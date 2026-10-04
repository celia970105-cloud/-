export type NavigationTab = 'subway' | 'video' | 'game' | 'report' | 'certificate';

export interface GameState {
  currentStage: number; // 1 to 5
  totalScore: number;
  stageScores: Record<number, number>;
  completedStages: number[];
  energyLevel: number; // 0 - 100
  lumbarFatigue: number; // 0 - 100 (lower is better)
  empathyPoints: number; // empathy gained
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'recommended' | 'harmful';
  description: string;
  effect: {
    nauseaDelta: number; // negative reduces nausea
    energyDelta: number;
  };
  icon: string;
}

export interface TrimesterInfo {
  id: number;
  name: string;
  weeks: string;
  babySize: string;
  babyLength: string;
  babyWeight: string;
  physicalChanges: string[];
  psychologicalChanges: string[];
  commonDiscomforts: string[];
  careTips: string[];
  partnerSupportAdvice: string[];
}

export interface ExperienceLogEntry {
  day: string;
  timeSlot: string;
  activity: string;
  simulatedWeight: string;
  discomfortLevel: number; // 1 to 10
  fatigueLevel: number; // 1 to 10
  observation: string;
  reflection: string;
}

export interface StudentReportData {
  projectName: string;
  courseName: string;
  instructorName: string;
  studentNames: string;
  submissionDate: string;
  weightUsedKg: number;
  bellyCircumferenceCm: number;
  hoursWorn: number;
  summaryReflection: string;
  partnerAppreciation: string;
  campusSuggestion: string;
}
