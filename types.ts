
export type EraId = 'renaissance' | '19th_century' | 'modern';

export interface Era {
  id: EraId;
  name: string;
  range: string;
  color: string;
}

export interface LessonReward {
  type: 'painting' | 'fragment';
  name: string;
  nameEn?: string;
  image: string;
  year?: string;
  location?: string;
  material?: string;
  dimensions?: string;
  count?: number;
  total?: number;
}

export interface Lesson {
  id: number;
  type: 'lesson';
  name: string;
  status: 'completed' | 'active' | 'locked';
  stars: number;
  icon: string;
  reward: LessonReward;
  isBoss?: boolean;
}

export interface Level {
  id: string;
  name: string;
  label: string;
  status: 'active' | 'locked' | 'completed';
  lessons: Lesson[];
}

export interface BioEvent {
  year: string;
  title: string;
  desc: string;
  image: string;
  imageCaption?: string;
  storyId?: string;
}

export interface Painter {
  id: string;
  name: string;
  nameEn: string;
  avatar: string;
  desc: string;
  birthPlace?: string;
  lifespan?: string;
  schoolName?: string;
  mascotState: 'active' | 'waving' | 'sleeping';
  cardLevel: number;
  bioEvents?: BioEvent[];
  levels: Level[];
}

export interface School {
  id: string;
  name: string;
  description: string;
  color: string;
  borderColor: string;
  painters: Painter[];
}

export interface Region {
  id: string;
  name: string;
  flag: string;
  description: string;
  schools: School[];
}

export interface QuizQuestion {
  id: number;
  text: string;
  options: string[];
  answer: number;
}
