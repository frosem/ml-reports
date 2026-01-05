/**
 * Allure CLI - Run tests and generate Allure reports
 *
 * SHARDING vs WORKERS (Parallelism)
 * =================================
 * Imagine you have 40 tests to run:
 *
 * - Shards split tests across separate processes (like hiring 4 people to do the work)
 *   Example: 4 shards means tests 1-10 go to shard 1, tests 11-20 to shard 2, etc.
 *   In CI, each shard runs on a different machine. Locally, we spawn 4 processes.
 *
 * - Workers are browser instances inside each shard (like giving each person 2 hands)
 *   Example: 2 workers means each shard runs 2 tests at the same time.
 *
 * With 4 shards and 2 workers, you run 8 tests simultaneously (4 × 2 = 8).
 *
 * Configuration lives in package.json:
 *   { "config": { "shards": 4, "workers": 2 } }
 *
 * COMMANDS
 * ========
 *   run       <framework>   Run tests with sharding, then generate report
 *   clean     [framework]   Delete results and reports
 *   generate  <framework>   Generate report from existing results
 *   history   <framework>   Copy history from previous report to results
 *   open      <framework>   Open the report in browser
 *
 * OPTIONS
 * =======
 *   --tags=@smoke,@high   Only run tests matching these tags
 *   --shards=2            Override the number of shards from package.json
 *
 * EXAMPLES
 * ========
 *   npm run allure -- run playwright --tags=@smoke
 *   npm run allure -- run cypress --tags=@high,@critical
 *   npm run allure -- run playwright --shards=2
 *   npm run allure:clean -- playwright
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync, readFileSync } from 'node:fs';
import { execSync, spawn } from 'node:child_process';
import { join } from 'node:path';
import { categories, directories, Framework } from '@shared/config/allure.config';

const FRAMEWORKS = Object.keys(categories) as Framework[];

// Command options
interface CommandOptions {
  shard?: { current: number; total: number };  // For CI: run single shard (e.g., --shard=1/4)
  shards?: number;                             // For local: override total shards
  tags?: string;                               // Filter by tags (affects directory selection)
}

// Get framework from CLI args
function getFramework(): Framework | null {
  const arg = process.argv[3];
  if (!arg) return null;
  if (arg.startsWith('--')) return null; // It's an option, not a framework
  if (FRAMEWORKS.includes(arg as Framework)) return arg as Framework;
  console.error(`Invalid framework: ${arg}. Use: ${FRAMEWORKS.join(', ')}`);
  process.exit(1);
}

// Parse command options from CLI args
function parseOptions(): CommandOptions {
  const options: CommandOptions = {};

  for (const arg of process.argv.slice(4)) {
    if (arg.startsWith('--shard=')) {
      // CI mode: --shard=1/4 means run shard 1 of 4
      const match = arg.replace('--shard=', '').match(/^(\d+)\/(\d+)$/);
      if (match) {
        options.shard = { current: parseInt(match[1], 10), total: parseInt(match[2], 10) };
      }
    } else if (arg.startsWith('--shards=')) {
      // Local mode: --shards=4 means spawn 4 parallel processes
      options.shards = parseInt(arg.replace('--shards=', ''), 10);
    } else if (arg.startsWith('--tags=')) {
      options.tags = arg.replace('--tags=', '');
    }
  }

  return options;
}

// Read shards configuration from package.json
function getDefaultShards(): number {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
    return packageJson.config?.shards ?? 4;
  } catch {
    return 4;
  }
}

// Configuration - uses shared directory constants

function getResultsDir(framework: Framework, hasTags: boolean = false): string {
  const baseDir = hasTags ? directories.resultsOnDemand : directories.results;
  return join(baseDir, framework);
}

function getReportDir(framework: Framework, hasTags: boolean = false): string {
  const baseDir = hasTags ? directories.reportOnDemand : directories.report;
  return join(baseDir, framework);
}

// Command interface
interface Command {
  execute(): void | Promise<void>;
}

// Clean command - removes results and reports
class CleanCommand implements Command {
  constructor(private framework: Framework | null) {}

  execute(): void {
    if (this.framework) {
      // Clean specific framework
      const dirs = [getResultsDir(this.framework), getReportDir(this.framework)];
      dirs.forEach((dir) => {
        if (existsSync(dir)) {
          rmSync(dir, { force: true, recursive: true });
          console.log(`Removed ${dir}`);
        }
      });
    } else {
      // Clean all frameworks
      const dirs = [directories.results, directories.report];
      dirs.forEach((dir) => {
        if (existsSync(dir)) {
          rmSync(dir, { force: true, recursive: true });
          console.log(`Removed ${dir}`);
        }
      });
    }
    console.log('Clean complete.');
  }
}

// CleanOld command - removes results older than retention period
class CleanOldCommand implements Command {
  constructor(private framework: Framework | null) {}

  execute(): void {
    const frameworks = this.framework ? [this.framework] : FRAMEWORKS;
    for (const fw of frameworks) {
      const resultsDir = getResultsDir(fw);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - directories.retentionDays);

      let deletedCount = 0;

      if (!existsSync(resultsDir)) {
        console.log(`No ${fw} results directory found. Skipping.`);
        continue;
      }

      const files = readdirSync(resultsDir);
      for (const file of files) {
        if (file === directories.history) continue;

        const filePath = join(resultsDir, file);
        const stats = statSync(filePath);

        if (stats.mtime < cutoffDate) {
          rmSync(filePath, { force: true, recursive: true });
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`[${fw}] Cleaned up ${deletedCount} files older than ${directories.retentionDays} days.`);
      } else {
        console.log(`[${fw}] No old files to clean.`);
      }
    }
  }
}

// History command - copies history from previous report to results directory
class HistoryCommand implements Command {
  constructor(
    private framework: Framework,
    private hasTags: boolean = false
  ) {}

  execute(): void {
    const resultsDir = getResultsDir(this.framework, this.hasTags);
    const reportDir = getReportDir(this.framework, this.hasTags);
    const sourceHistory = join(reportDir, directories.history);
    const targetHistory = join(resultsDir, directories.history);

    if (!existsSync(sourceHistory)) {
      console.log(`[${this.framework}] No previous history found. This is the first run.`);
      return;
    }

    if (existsSync(targetHistory)) {
      return; // History already exists, don't overwrite
    }

    mkdirSync(targetHistory, { recursive: true });
    cpSync(sourceHistory, targetHistory, { recursive: true });
    console.log(`[${this.framework}] History copied from previous report.`);
  }
}

// Generate command - generates report with history
class GenerateCommand implements Command {
  private hasTags: boolean;

  constructor(
    private framework: Framework,
    options: CommandOptions = {}
  ) {
    this.hasTags = !!options.tags;
  }

  execute(): void {
    const resultsDir = getResultsDir(this.framework, this.hasTags);
    const reportDir = getReportDir(this.framework, this.hasTags);

    new HistoryCommand(this.framework, this.hasTags).execute();

    const cmd = `allure generate ${resultsDir} -o ${reportDir} --clean`;
    console.log(`[${this.framework}] Generating Allure report...`);
    execSync(cmd, { stdio: 'inherit' });

    // Output path for CI to capture
    console.log(`REPORT_DIR=${reportDir}`);
  }
}

// Open command - opens the report
class OpenCommand implements Command {
  constructor(private framework: Framework) {}

  execute(): void {
    const reportDir = getReportDir(this.framework);
    if (!existsSync(reportDir)) {
      console.error(`[${this.framework}] No report found. Run "generate ${this.framework}" first.`);
      process.exit(1);
    }

    const cmd = `allure open ${reportDir}`;
    execSync(cmd, { stdio: 'inherit' });
  }
}

// Run command - orchestrates test execution with history from previous report
class RunCommand implements Command {
  private hasTags: boolean;

  constructor(
    private framework: Framework,
    private options: CommandOptions
  ) {
    this.hasTags = !!options.tags;
  }

  async execute(): Promise<void> {
    // CI mode: run single shard, no setup/cleanup (CI handles that)
    if (this.options.shard) {
      await this.runSingleShard();
      return;
    }

    // Local mode: full orchestration with all shards
    await this.runAllShards();
  }

  /**
   * CI mode: Run just one shard. CI matrix handles parallelism.
   * Each CI machine calls: npm run allure -- run playwright --shard=1/4 --tags=@smoke
   */
  private async runSingleShard(): Promise<void> {
    const { current, total } = this.options.shard!;
    const resultsDir = getResultsDir(this.framework, this.hasTags);

    console.log(`\n[${this.framework}] Running shard ${current}/${total}...`);
    if (this.options.tags) {
      console.log(`  Tags: ${this.options.tags}`);
      console.log(`  Output: ${resultsDir}`);
    }

    // Ensure results directory exists
    mkdirSync(resultsDir, { recursive: true });

    // Run just this shard
    const passed = await this.spawnShard(current, total);

    if (!passed) {
      process.exit(1);
    }
  }

  /**
   * Local mode: Full orchestration - clean results, copy history, run all shards, generate report.
   */
  private async runAllShards(): Promise<void> {
    const resultsDir = getResultsDir(this.framework, this.hasTags);
    const reportDir = getReportDir(this.framework, this.hasTags);

    console.log(`\n[${this.framework}] Starting test run...`);
    if (this.options.tags) {
      console.log(`  Tags: ${this.options.tags}`);
      console.log(`  Output: ${reportDir}`);
    }

    // Step 1: Clean old results to ensure only current run tests appear
    if (existsSync(resultsDir)) {
      console.log(`[${this.framework}] Cleaning previous results...`);
      rmSync(resultsDir, { force: true, recursive: true });
    }
    mkdirSync(resultsDir, { recursive: true });

    // Step 2: Copy history from previous report (if exists)
    new HistoryCommand(this.framework, this.hasTags).execute();

    // Step 3: Run tests with shards in parallel, each shard uses workers internally
    const shards = this.options.shards ?? getDefaultShards();
    const testsPassed = await this.runTestsWithSharding(shards);

    // Step 4: Generate and open report
    console.log(`\n[${this.framework}] Generating Allure report...`);
    const generateCmd = `allure generate ${resultsDir} -o ${reportDir} --clean`;
    execSync(generateCmd, { stdio: 'inherit' });

    console.log(`\n[${this.framework}] Opening report in background...`);
    spawn('allure', ['open', reportDir], { detached: true, stdio: 'ignore' }).unref();

    if (!testsPassed) {
      process.exit(1);
    }
  }

  /**
   * Runs tests using sharding: splits the test suite across multiple processes.
   * Each shard is a separate process that runs a portion of the tests.
   * All shards run simultaneously (parallel execution).
   *
   * Example with 4 shards and 40 tests:
   *   Shard 1 runs tests 1-10
   *   Shard 2 runs tests 11-20
   *   Shard 3 runs tests 21-30
   *   Shard 4 runs tests 31-40
   *
   * Playwright also uses workers (2 browser instances per shard).
   * Cypress runs one test at a time per shard (no workers).
   */
  private async runTestsWithSharding(totalShards: number): Promise<boolean> {
    console.log(`[${this.framework}] Running tests with ${totalShards} parallel shards...`);

    const shardPromises: Promise<boolean>[] = [];

    for (let shard = 1; shard <= totalShards; shard++) {
      console.log(`  [Shard ${shard}/${totalShards}] Starting...`);
      const promise = this.spawnShard(shard, totalShards);
      shardPromises.push(promise);
    }

    const results = await Promise.all(shardPromises);
    const passed = results.filter(Boolean).length;
    const failed = results.length - passed;
    console.log(`\n[${this.framework}] Shards completed: ${passed} passed, ${failed} failed`);

    return failed === 0;
  }

  /**
   * Spawns a single shard process and returns a promise that resolves when it finishes.
   * We don't await here - the caller collects all promises and waits for them together.
   */
  private spawnShard(shard: number, totalShards: number): Promise<boolean> {
    const { args, env } = this.buildShardCommand(shard, totalShards);

    return new Promise<boolean>((resolve) => {
      const child = spawn('npx', args, { stdio: 'inherit', env, shell: true });
      child.on('close', (code) => resolve(code === 0));
      child.on('error', () => resolve(false));
    });
  }

  /**
   * Builds the command and environment variables for running a shard.
   *
   * Playwright has built-in sharding support:
   *   npx playwright test --shard=2/4    (runs the second quarter of tests)
   *   npx playwright test --grep "@smoke" (filters tests by tag)
   *
   * Cypress has no built-in sharding, so we use the cypress-split plugin
   * which reads these environment variables:
   *   SPLIT=4         (total number of shards)
   *   SPLIT_INDEX1=2  (which shard to run, starting from 1)
   *   CYPRESS_grepTags="@smoke @critical" (filters tests by tag)
   *
   * ALLURE_ON_DEMAND=true tells allure.config.ts to write to on-demand-results/
   */
  private buildShardCommand(shard: number, totalShards: number): { args: string[]; env: Record<string, string> } {
    const baseEnv: Record<string, string> = {
      ...process.env as Record<string, string>,
      FORCE_COLOR: '1',
    };

    // Tell Allure config which results directory to use
    baseEnv.ALLURE_RESULTS_DIR = getResultsDir(this.framework, this.hasTags);

    if (this.framework === 'playwright') {
      const args = ['playwright', 'test', `--shard=${shard}/${totalShards}`];
      if (this.options.tags) {
        args.push('--grep', `"${this.options.tags.split(',').join('|')}"`);
      }
      return { args, env: baseEnv };
    }

    // Cypress with cypress-split plugin
    const env = {
      ...baseEnv,
      SPLIT: totalShards.toString(),
      SPLIT_INDEX1: shard.toString(),
    };
    if (this.options.tags) {
      env['CYPRESS_grepTags'] = this.options.tags.split(',').join(' ');
    }
    return { args: ['cypress', 'run', '--browser', 'chrome'], env };
  }
}

// Commands that require a framework argument
const FRAMEWORK_REQUIRED = ['generate', 'history', 'open', 'run'];

// CLI entry point
async function main(): Promise<void> {
  const command = process.argv[2];
  const framework = getFramework();
  const options = parseOptions();

  const commands = ['clean', 'clean:old', 'generate', 'history', 'open', 'run'];

  if (!command || !commands.includes(command)) {
    console.log('Allure CLI - Usage: npx tsx scripts/allure-cli.ts <command> [framework] [options]');
    console.log('');
    console.log('Commands:');
    console.log('  clean     [framework] - Remove results and reports');
    console.log('  clean:old [framework] - Remove old results (>30 days)');
    console.log('  generate  <framework> - Generate report (outputs REPORT_DIR)');
    console.log('  history   <framework> - Copy history from previous report to results');
    console.log('  open      <framework> - Open the generated report');
    console.log('  run       <framework> - Run tests with sharding');
    console.log('');
    console.log('Options:');
    console.log('  --tags=@smoke,@critical  Filter by tags (affects directories)');
    console.log('  --shard=1/4              CI: run single shard');
    console.log('  --shards=4               Local: override parallel shards');
    console.log('');
    console.log(`Frameworks: ${FRAMEWORKS.join(', ')}`);
    console.log('');
    console.log('CI workflow example:');
    console.log('  npm run allure -- run playwright --shard=1/4 --tags=@smoke');
    console.log('  npm run allure -- generate playwright --tags=@smoke   # outputs REPORT_DIR');
    process.exit(command ? 1 : 0);
  }

  // Check if framework is required
  if (FRAMEWORK_REQUIRED.includes(command) && !framework) {
    console.error(`Error: "${command}" requires a framework argument.`);
    console.error(`Usage: npx tsx scripts/allure-cli.ts ${command} <${FRAMEWORKS.join('|')}>`);
    process.exit(1);
  }

  // Execute command
  switch (command) {
    case 'clean':
      new CleanCommand(framework).execute();
      break;
    case 'clean:old':
      new CleanOldCommand(framework).execute();
      break;
    case 'generate':
      new GenerateCommand(framework!, options).execute();
      break;
    case 'history':
      new HistoryCommand(framework!, !!options.tags).execute();
      break;
    case 'open':
      new OpenCommand(framework!).execute();
      break;
    case 'run':
      await new RunCommand(framework!, options).execute();
      break;
  }
}

main().catch(console.error);

