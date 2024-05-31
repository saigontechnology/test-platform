
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
    api: (assessmentId: string) => `/assessment/${assessmentId}`,
  },
};

export const AUTH_API = {
  signIn: {
    api: "/auth/login"
  }
}

export const USER_API = {
  getCandidates: {
    api: "/admin/candidate/list",
  },
};