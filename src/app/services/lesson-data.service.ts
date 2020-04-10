import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import data from "../../assets/content/lesson_data.json";
//import { HTTP } from '@ionic-native/http/ngx/'; // mobile

// Handles data state

export interface EditorInputs {
  input: string;
  quiz_output: string;
  quiz_input: string;
  languages: Language[];
}

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
  type: string;
  content: string;
  link: string;
  style: string;
}

export interface RawSlide {
  content: RawHTML[];
}

export interface AppState {
  selectedLesson: LessonItem;
  defaultEditorInput: EditorInputs;
  demoMode: boolean;
  quizMode: boolean;
}

/* Confused noises */
@Injectable({
  providedIn: "root",
})
export class LessonDataService {
  private rawData: LessonData[] = data;

  private appState: AppState = {
    //state of app
    defaultEditorInput: undefined,
    selectedLesson: undefined,
    demoMode: false,
    quizMode: false,
  };

  public async getCodeTemplates(): Promise<EditorInputs> {
    let raw_template: string = await this.readFile(
      "../assets/code-editor-default-templates.txt"
    );

    return this.parseCodeTxt(raw_template);
  }

  public async getDemo(url: string): Promise<any> {
    let file_url: string = "../assets/content/" + url;
    let rawCode: string = await this.readFile(file_url);
    console.log(rawCode);
    return this.parseCodeTxt(rawCode);
  }

  public getQuiz(): string {
    return "not implemented";
  }

  public escapeJson(faulty_json: string): string {
    /*
        json escapes. 
        newline -> \n        /\n/ => '\n'
        Tab -> \t            /\t/ => '\t'
        Double Quote ->\"    /\"/ => '\"'
        \ -> \\              /\\/ => '\\'
                             /\f/ => '\f'
                             /\r/ => '\r'
                             [\b] => '\b'
      */

    return faulty_json
      .trim()
      .replace(/\\/g, "\\\\")
      .replace(/\t/g, "\\t")
      .replace(/\"/g, '\\"')
      .replace(/\f/g, "\\f")
      .replace(/\r/g, "\\r")
      .replace(/[\b]/g, "\\b")
      .replace(/\n/g, "\\n");
  }

  public parseCodeTxt(rawString: string): EditorInputs {
    let jsonArray: string[] = [];

    let type_split: string = "%%%%segment-splitter>>>>>";
    let code_split: string = "||||||||||";

    let jsonString: string = "";
    let rawCodes: string[] = rawString.split(type_split);
    let seperator: string = '"languages":[{\n"language":"';

    for (let code of rawCodes) {
      if (code.trim() == "") {
        continue;
      }

      let code_grp: string[] = code.split(code_split);
      code_grp[1] = this.escapeJson(code_grp[1]);
      if (
        code_grp[0] == "input" ||
        code_grp[0] == "quiz_output" ||
        code_grp[0] == "quiz_input"
      ) {
        jsonArray.push('"' + code_grp[0].trim() + '":"' + code_grp[1] + '"');
      } else {
        jsonString += seperator + code_grp[0].trim() + '","code":"';
        jsonString += code_grp[1] + '"\n}';
        seperator = ',{\n"language":"';
      }
    }

    jsonString += "]";
    jsonArray.push(jsonString);

    let parsedJson: EditorInputs = JSON.parse(
      "{\n" + jsonArray.join(",") + "\n}"
    );
    parsedJson.languages.sort((a, b) => (a.language > b.language ? 1 : -1));

    return parsedJson;
  }

  public getAllLessonData(): LessonData[] {
    console.log(this.rawData);
    return this.rawData;
  }

  public selectLesson(lesson: LessonItem): void {
    this.appState.selectedLesson = lesson;
  }

  public getSelected(): LessonItem {
    return this.appState.selectedLesson;
  }

  public async *getSelectedContent(folder_string: string = "") {
    let url =
      "../assets/content/" +
      this.appState.selectedLesson.id +
      "/" +
      folder_string;

    let content: string[] = (await this.readFile(url + "content.txt")).split(
      "\n"
    );

    let content_generator = this.parseData(content);
    for await (let slide of content_generator) {
      yield slide;
    }
  }

  public async *parseData(content: string[]) {
    let i = -1;
    let j = 0;

    let current_page: RawSlide = { content: [] };

    while (++i < content.length) {
      content[i] = content[i].trim();

      if (content[i] == "<-- end-page -->") {
        yield { ...current_page }; // yield generated page
        current_page.content = [];
        continue;
      }

      let slide_element: RawHTML = {
        type: "",
        content: "",
        link: "",
        style: "",
      };

      switch (content[i]) {
        case "<-- title -->":
          slide_element.content = content[++i];
          console.log(i);
          slide_element.type = "title";
          break;

        case "<-- demo -->":
          slide_element.link = content[++i];
          //console.log(slide_element.link);
          slide_element.type = "demo";
          break;

        case "<-- quiz -->":
          slide_element.link = content[++i];
          //console.log(slide_element.link);
          slide_element.type = "quiz";
          break;
        case "<-- image -->":
          slide_element.link = content[++i];
          slide_element.type = "image";
          break;
        case "":
          slide_element.type = "br";
          break;
        default:
          slide_element.content = content[i];
          slide_element.type = "p";
          break;
      }
      current_page.content.push({ ...slide_element });
      slide_element = {
        type: "",
        content: "",
        link: "",
        style: "",
      };
    }
    return;
  }

  private readFile(url: string) {
    console.log(url);
    return this.http.get(url, { responseType: "text" }).toPromise();
  }

  constructor(private http: HttpClient) {}
}
