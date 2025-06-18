export interface DeleteAssignment$Params {
  assignmentId: string;
}

export interface DeleteAssignment$Response {
  // DELETE typically returns no content, but we can define this for future use
  success?: boolean;
  message?: string;
} 