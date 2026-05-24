export type ImportFileKind =
  | "health_key_metrics"
  | "health_checkup_metrics"
  | "health_findings_actions"
  | "networth_snapshot"
  | "investment_holdings"
  | "pension_cashflow"
  | "tax_history";

export type ImportFileDefinition = {
  kind: ImportFileKind;
  fileName: string;
  sourceName: string;
  ownerScope: "USER_JH" | "FAMILY_COMBINED";
  requiredColumns: string[];
};

export type ImportValidationIssue = {
  fileName: string;
  rowNumber: number;
  message: string;
};

export type ImportFileReport = {
  fileName: string;
  kind: ImportFileKind;
  rawRows: number;
  rawRowsInserted: number;
  domainRows: number;
  validationErrors: number;
};

export type ImportRunReport = {
  startedAt: string;
  finishedAt: string;
  filesProcessed: number;
  rawRows: number;
  rawRowsInserted: number;
  domainRows: number;
  validationErrors: ImportValidationIssue[];
  files: ImportFileReport[];
};
