export type LetterType = 
  | 'standard' 
  | 'hugs' 
  | 'sick' 
  | 'miss' 
  | 'angry' 
  | 'sleep' 
  | 'serious' 
  | 'surprise' 
  | 'secret' 
  | 'future' 
  | 'photo' 
  | 'voice' 
  | 'final';

export interface LetterConfig {
  id: string;
  title: string;
  icon: string;
  type: LetterType;
  isHidden?: boolean; // For the secret letter 9
  // Content fields for various types
  content?: string; 
  list?: string[];
  randomMessages?: string[];
  photoPath?: string;
  photoPaths?: string[];
  audioPath?: string;
  date?: string;
}
