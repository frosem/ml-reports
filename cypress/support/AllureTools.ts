import { attachment, link, step, testCaseId } from 'allure-cypress';
import { ContentType, logStep, Status } from 'allure-js-commons';
import { BaseAllureTools } from '@shared/allure/BaseAllureTools';
import { allureDecorator } from '@shared/allure/AllureStepDecorator';

class AllureTools extends BaseAllureTools {
  protected attachHtml(name: string, html: string): void {
    attachment(name, html, ContentType.HTML);
  }

  protected addLink(id: string, name: string, type: string): void {
    link(id, name, type);
  }

  protected addLogStep(message: string, status: Status): void {
    logStep(message, status);
  }

  protected addTestCaseId(id: string): void {
    testCaseId(id);
  }
}

const allureTools = new AllureTools();

export const attachAssertion = allureTools.attachAssertion.bind(allureTools);
export const storyLink = allureTools.storyLink.bind(allureTools);
export const testLink = allureTools.testLink.bind(allureTools);
export const allureStep = allureDecorator(step);

