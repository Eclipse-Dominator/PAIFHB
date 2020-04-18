export interface Language {
  language: string;
  code: string;
}

export interface LessonData {
  data: LessonItem[];
  category: string;
}

export interface LessonItem {
  title: string;
  icon: string;
  id: string;
}

export interface RawHTML {
  type: "p" | "image" | "title" | "quiz" | "demo" | "br" | "";
  content?: string;
  link?: string;
  style?: string;
  extrafile?: file_item[];
}

export interface file_item {
  name: string;
  content: string;
  location?: string;
}

export interface RawSlide {
  content: RawHTML[];
  name?: string;
}

export interface AppState {
  selectedLesson: LessonItem;
  defaultEditorInput: EditorInputs;
  demoMode: boolean;
  quizMode: boolean;
}

export interface Response {
  id: string;
  language: string;
  note: null | string;
  status: string;
  build_stdout: null | string;
  build_stderr: null | string;
  build_exit_code: number;
  build_time: null | number;
  build_memory: number;
  build_result: null | string;
  stdout: string;
  stderr: string;
  exit_code: number;
  time: string;
  memory: number;
  connections: number;
  result: string;
}

export interface FilteredResponse {
  language: string;
  stdout: string;
  stderr: string;
  time: string;
  result: boolean;
}

export interface IncompleteResponse {
  id: string;
  status: string;
  error: string;
}

export interface EditorInputs {
  input?: string;
  quiz_output?: string;
  quiz_input?: string;
  languages: Language[];
}
