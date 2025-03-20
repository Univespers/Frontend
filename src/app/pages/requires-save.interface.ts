export interface RequiresSave {
  alertMessage: string;
  hasUnsavedChanges(): boolean;
}
