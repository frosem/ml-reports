/**
 * Types for reading Allure test result files.
 */

import { LabelName, Status, type Label, type StatusDetails } from 'allure-js-commons';

export { LabelName, Status, type Label, type StatusDetails };

export interface AllureStep {
  name: string;
  status: Status | string;
  statusDetails?: StatusDetails;
  steps?: AllureStep[];
}

export interface AllureResult {
  fullName?: string;
  historyId?: string;
  labels?: Label[];
  name?: string;
  start?: number;
  status: Status | string;
  statusDetails?: StatusDetails | null;
  steps?: AllureStep[];
  stop?: number;
  uuid: string;
}

export interface FailedStep {
  name: string;
  status: string;
  statusDetails?: StatusDetails;
}

export interface FailedTestInfo {
  duration: number;
  errorMessage: string;
  errorTrace: string;
  fullName: string;
  historyId: string;
  name: string;
  package: string;
  status: string;
  steps: FailedStep[];
  suite: string;
  uuid: string;
}
