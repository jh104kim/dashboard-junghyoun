import type { ImportFileReport, ImportRunReport, ImportValidationIssue } from "@/lib/import/types";

export function createImportReport(startedAt = new Date().toISOString()): ImportRunReport {
  return {
    startedAt,
    finishedAt: startedAt,
    filesProcessed: 0,
    rawRows: 0,
    rawRowsInserted: 0,
    domainRows: 0,
    validationErrors: [],
    files: [],
  };
}

export function addFileReport(
  report: ImportRunReport,
  fileReport: ImportFileReport,
  validationErrors: ImportValidationIssue[],
) {
  report.filesProcessed += 1;
  report.rawRows += fileReport.rawRows;
  report.rawRowsInserted += fileReport.rawRowsInserted;
  report.domainRows += fileReport.domainRows;
  report.validationErrors.push(...validationErrors);
  report.files.push(fileReport);
  report.finishedAt = new Date().toISOString();
}

export function toSafeConsoleSummary(report: ImportRunReport) {
  return {
    filesProcessed: report.filesProcessed,
    rawRows: report.rawRows,
    rawRowsInserted: report.rawRowsInserted,
    domainRows: report.domainRows,
    validationErrors: report.validationErrors.length,
    files: report.files,
  };
}
