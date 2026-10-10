export interface Training {
  id: string;
  title: string;
  provider: string;
  date: string;
  skills: string;
  content: string;
}

export interface InterviewerProfile {
  title: string;
  lensPerspective: string;
  corePriorities: string[];
  hiddenFears: string[];
}

export interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  intent: string;
  assessmentPoints: string[];
  strategyTip: string;
  sampleAnswer: string;
  pitfallsToAvoid: string;
}

export interface CounterQuestion {
  question: string;
  strategicReason: string;
  bestTiming: string;
}

export interface InterviewPlanResult {
  interviewerProfile: InterviewerProfile;
  questions: InterviewQuestion[];
  counterQuestions: CounterQuestion[];
  executiveSummary: string;
}

export interface StarAnalysis {
  situation: string;
  task: string;
  action: string;
  result: string;
}

export interface AnswerEvaluationResult {
  score: number;
  ratingLabel: string;
  strengths: string[];
  improvementAreas: string[];
  starAnalysis: StarAnalysis;
  improvedVersion: string;
  coachTip: string;
}

export interface CurrentSkillMatrix {
  levelTitle: string;
  solidCompetencies: string[];
  summaryAnalysis: string;
}

export interface SkillGap {
  gapName: string;
  impactLevel: string;
  description: string;
}

export interface CurriculumModule {
  moduleName: string;
  description: string;
}

export interface CapstoneProjectIdea {
  projectTitle: string;
  projectDetails: string;
}

export interface ActionPlan {
  first30Days: string;
  day31to60: string;
  day61to90: string;
}

export interface NextTrainingRecommendation {
  trainingTitle: string;
  idealFormat: string;
  whyThisTraining: string;
  curriculumModules: CurriculumModule[];
  recommendedCertifications: string[];
  capstoneProjectIdea: CapstoneProjectIdea;
  actionPlan: ActionPlan;
}

export interface TrainingAnalysisResult {
  currentSkillMatrix: CurrentSkillMatrix;
  skillGaps: SkillGap[];
  nextTrainingRecommendation: NextTrainingRecommendation;
  careerCoachAdvice: string;
}

export type UserRole = 'client' | 'coach';

export interface ClientProfile {
  id: string;
  fullName: string;
  email: string;
  targetRole: string;
  targetCompany: string;
  interviewerTitle: string;
  interviewDate: string;
  status: 'Hazırlanıyor' | 'Simülasyon Aşamasında' | 'Mülakat Haftası' | 'Teklif Alındı';
  readinessScore: number;
  coachNotes: string[];
  assignedTasks: { id: string; text: string; done: boolean }[];
  completedSimulationsCount: number;
  lastActive: string;
  trainingsCount: number;
}

export interface LearningResource {
  id: string;
  title: string;
  category: 'Mülakat Hazırlığı' | 'Teknik Yetkinlik' | 'Liderlik & İletişim' | 'Sertifikasyon';
  type: 'Kitap' | 'Kurs' | 'Makale' | 'Rehber' | 'Sertifika';
  description: string;
  targetAudience: string;
  provider: string;
}

