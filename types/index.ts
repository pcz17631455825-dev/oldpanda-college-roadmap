export type HollandKey = "R" | "I" | "A" | "S" | "E" | "C";
export type ValueKey = "stability" | "achievement" | "income" | "freedom" | "social";
export type Faction = "升学派" | "就业派" | "体制派";
export interface Scores extends Partial<Record<HollandKey | ValueKey, number>> {}
export interface Question { id: number; type: "single" | "multiple"; maxSelections?: number; category: "holland" | "values" | "personality"; text: string; options: { label: string; scores: Scores }[] }
export interface Major { id: string; name: string; category: string; degree: string; coreCourses: string[]; careerPaths: string[]; salary: { freshman: string; experienced: string }; gradSchool: string[]; govFit: "high" | "medium" | "low"; govFitNote: string; publicJobs: "多" | "中等" | "少"; publicJobNote: string; employmentFitNote: string; studyFitNote: string; hollandTypes: HollandKey[]; suitableTraits: string; warnings: string[]; matchTags: string[]; outlook: number; studyFriendly: number; tag: string }
export interface AssessmentResult { hollandCode: string; hollandScores: Record<HollandKey, number>; valueScores: Record<ValueKey, number>; valuesRanking: ValueKey[]; faction: Faction; factionDescription: string; recommendations: { major: Major; matchScore: number }[]; duration: number }
