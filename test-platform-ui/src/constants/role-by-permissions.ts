export enum TFPermissions {
  READ = 'read',
  EDIT = 'edit',
  CREATE = 'create',
  DELETE = 'delete',
  SETTING = 'setting',
  READ_QUESTION = 'read_question',
  EDIT_QUESTION = 'edit_question',
  CREATE_QUESTION = 'create_question',
  ARCHIVE_QUESTION = 'archive_question',
  READ_ASSESSMENT = 'read_assessment',
  EDIT_ASSESSMENT = 'edit_assessment',
  CREATE_ASSESSMENT = 'create_assessment',
  ARCHIVE_ASSESSMENT = 'archive_assessment',
}

export const roleByPermissions = {
  ManageQuestion: [
    TFPermissions.EDIT_QUESTION,
    TFPermissions.READ_QUESTION,
    TFPermissions.CREATE_QUESTION,
    TFPermissions.ARCHIVE_QUESTION,
  ],
  ManageAssessment: [
    TFPermissions.EDIT_ASSESSMENT,
    TFPermissions.READ_ASSESSMENT,
    TFPermissions.CREATE_ASSESSMENT,
    TFPermissions.ARCHIVE_ASSESSMENT,
  ],
  QuestionEditor: [TFPermissions.READ_QUESTION, TFPermissions.EDIT_QUESTION],
  AssessmentEditor: [
    TFPermissions.READ_ASSESSMENT,
    TFPermissions.EDIT_ASSESSMENT,
  ],
};
