/**
 * Allure CLI - Unified command-line tool for Allure operations
 *
 * Usage: npx tsx scripts/allure-cli.ts <command> [framework]
 *
 * Commands:
 *   clean     [framework] - Remove results and reports (or all if no framework)
 *   clean:old [framework] - Remove results older than retention period
 *   history   <framework> - Copy history from previous report to results
 *   generate  <framework> - Generate report with history preservation
 *   open      <framework> - Open the generated report
 *
 * Frameworks: cypress, playwright
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';

// Supported frameworks
type Framework = 'cypress' | 'playwright';
const FRAMEWORKS: Framework[] = ['cypress', 'playwright'];

// Get framework from CLI args
function getFramework(): Framework | null {
  const arg = process.argv[3];
  if (!arg) return null;
  if (FRAMEWORKS.includes(arg as Framework)) return arg as Framework;
  console.error(`Invalid framework: ${arg}. Use: ${FRAMEWORKS.join(', ')}`);
  process.exit(1);
}

// Configuration
const CONFIG = {
  baseResultsDir: 'allure-results',
  baseReportDir: 'allure-report',
  historyFolder: 'history',
  retentionDays: 30,
} as const;

function getResultsDir(framework: Framework): string {
  return join(CONFIG.baseResultsDir, framework);
}

function getReportDir(framework: Framework): string {
  return join(CONFIG.baseReportDir, framework);
}

// Command interface
interface Command {
  execute(): void;
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
      const dirs = [CONFIG.baseResultsDir, CONFIG.baseReportDir];
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
      cutoffDate.setDate(cutoffDate.getDate() - CONFIG.retentionDays);

      let deletedCount = 0;

      if (!existsSync(resultsDir)) {
        console.log(`No ${fw} results directory found. Skipping.`);
        continue;
      }

      const files = readdirSync(resultsDir);
      for (const file of files) {
        if (file === CONFIG.historyFolder) continue;

        const filePath = join(resultsDir, file);
        const stats = statSync(filePath);

        if (stats.mtime < cutoffDate) {
          rmSync(filePath, { force: true, recursive: true });
          deletedCount++;
        }
      }

      if (deletedCount > 0) {
        console.log(`[${fw}] Cleaned up ${deletedCount} files older than ${CONFIG.retentionDays} days.`);
      } else {
        console.log(`[${fw}] No old files to clean.`);
      }
    }
  }
}

// History command - copies history from report to results
class HistoryCommand implements Command {
  constructor(private framework: Framework) {}

  execute(): void {
    const resultsDir = getResultsDir(this.framework);
    const reportDir = getReportDir(this.framework);
    const sourceHistory = join(reportDir, CONFIG.historyFolder);
    const targetHistory = join(resultsDir, CONFIG.historyFolder);

    if (!existsSync(sourceHistory)) {
      console.log(`[${this.framework}] No previous history found. This is the first run.`);
      return;
    }

    if (!existsSync(resultsDir)) {
      mkdirSync(resultsDir, { recursive: true });
    }

    cpSync(sourceHistory, targetHistory, { recursive: true });
    console.log(`[${this.framework}] History copied from previous report.`);
  }
}

// Generate command - generates report with history
class GenerateCommand implements Command {
  constructor(private framework: Framework) {}

  execute(): void {
    new HistoryCommand(this.framework).execute();

    const resultsDir = getResultsDir(this.framework);
    const reportDir = getReportDir(this.framework);
    const cmd = `allure generate ${resultsDir} -o ${reportDir} --clean`;
    console.log(`[${this.framework}] Generating Allure report...`);
    execSync(cmd, { stdio: 'inherit' });
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

// Commands that require a framework argument
const FRAMEWORK_REQUIRED = ['generate', 'history', 'open'];

// CLI entry point
function main(): void {
  const command = process.argv[2];
  const framework = getFramework();

  const commands = ['clean', 'clean:old', 'generate', 'history', 'open'];

  if (!command || !commands.includes(command)) {
    console.log('Allure CLI - Usage: npx tsx scripts/allure-cli.ts <command> [framework]');
    console.log('');
    console.log('Commands:');
    console.log('  clean     [framework] - Remove results and reports');
    console.log('  clean:old [framework] - Remove old results (>30 days)');
    console.log('  generate  <framework> - Generate report with history');
    console.log('  history   <framework> - Copy history from previous report');
    console.log('  open      <framework> - Open the generated report');
    console.log('');
    console.log(`Frameworks: ${FRAMEWORKS.join(', ')}`);
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
      new GenerateCommand(framework!).execute();
      break;
    case 'history':
      new HistoryCommand(framework!).execute();
      break;
    case 'open':
      new OpenCommand(framework!).execute();
      break;
  }
}

main();

