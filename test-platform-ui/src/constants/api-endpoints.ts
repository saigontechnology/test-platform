export const EXAMINATION_API = {
  getExaminationInfo: {
    api: (examId: string) => `/examinations/${examId}`,
  },
  submitExamination: {
    api: (examId: string) => `/examinations/${examId}`,
  },
  updateAssessmentExpired: {
    api: (examId: string) => `/examinations/expired/${examId}`,
  },
};

export const ASSESSMENT_API = {
  getAssessmentById: {
    api: (assessmentId: string) => `/assessments/${assessmentId}`,
  },
};