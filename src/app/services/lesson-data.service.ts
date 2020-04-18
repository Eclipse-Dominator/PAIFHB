import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import data from "../../assets/content/lesson_data.json";
import {
  EditorInputs,
  Language,
  LessonData,
  LessonItem,
  RawHTML,
  RawSlide,
  AppState,
} from "./interfaces";
//import { HTTP } from '@ionic-native/http/ngx/'; // mobile

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

  public async loadEditor(url: string, quiz: boolean = false): Promise<Object> {
    let file_url: string = "../assets/content/";
    file_url += quiz ? url + "/quiz.txt" : url;
    let rawCode: string = await this.readFile(file_url);
    //console.log(rawCode);
    return this.parseCodeTxt(rawCode);
  }

  public reverseParseCode(ei: EditorInputs): string {
    let outputString: string = "";
    for (let x in ei) {
      if (ei[x]) {
        switch (x) {
          case "input":
            outputString += "%%%%segment-splitter>>>>>input||||||||||\n";
            outputString += ei.input;
            outputString += "\n";
            break;
          case "quiz_output":
            outputString += "%%%%segment-splitter>>>>>quiz_output||||||||||\n";
            outputString += ei.quiz_output;
            outputString += "\n";
            break;
          case "quiz_input":
            outputString += "%%%%segment-splitter>>>>>quiz_input||||||||||\n";
            outputString += ei.quiz_input;
            outputString += "\n";
            break;
          case "languages":
            for (let lang of ei.languages) {
              outputString += "%%%%segment-splitter>>>>>";
              outputString += lang.language;
              outputString += "||||||||||\n";
              outputString += lang.code;
              outputString += "\n";
            }
            break;
          default:
            break;
        }
      }
    }
    return outputString;
  }

  public parseCodeTxt(rawString: string): EditorInputs {
    let jsonArray: string[] = [];
    rawString = rawString.replace(/\r/g, "");
    let type_split: RegExp = /(?:\n?)(?:%%%%segment-splitter>>>>>)/;
    let code_split: RegExp = /(?:\|\|\|\|\|\|\|\|\|\|)(?:\n?)/;

    let jsonString: string = '"languages":[';

    let rawCodes: string[] = rawString.split(type_split);

    let seperator: string = '{\n"language":"';

    for (let code of rawCodes) {
      if (code.trim() == "") {
        continue;
      }

      let code_grp: string[] = code.split(code_split);
      code_grp[1] = JSON.stringify(code_grp[1]);

      if (
        code_grp[0] == "input" ||
        code_grp[0] == "quiz_output" ||
        code_grp[0] == "quiz_input"
      ) {
        jsonArray.push('"' + code_grp[0].trim() + '":' + code_grp[1]);
      } else {
        jsonString += seperator + code_grp[0].trim() + '","code":';
        jsonString += code_grp[1] + "\n}";
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
    return this.rawData;
  }

  public selectLesson(lesson: LessonItem): void {
    this.appState.selectedLesson = lesson;
  }

  public getSelected(): LessonItem {
    return this.appState.selectedLesson;
  }

  public async getSelectedContent(folder_string: string = "") {
    // if folder_string not empty, parse question.txt instead
    let url: string =
      "../assets/content/" + this.appState.selectedLesson.id + "/";
    url += folder_string ? folder_string + "/" : "";
    url += "content.txt";
    let content: string = await this.readFile(url);
    return this.parseData(content.split("\n"));
  }

  public *parseData(content: string[]) {
    let i = -1;
    let j = 0;

    let current_page: RawSlide = { content: [] };

    while (++i < content.length) {
      content[i] = content[i].trim();
      let within_tag = /^(?:<-- )([\S| ]+)(?: -->)$/g.exec(content[i]);
      let params: string[] = [content[i]];
      if (within_tag) {
        params = within_tag[1].split("/////");
      }
      if (params[0] == "end-page") {
        current_page.name = "Page" + ++j;
        if (params[1]) current_page.name = params[1];
        yield { ...current_page }; // yield generated page
        current_page.content = [];
        continue;
      }

      let slide_element: RawHTML = {
        type: "",
        content: "",
      };

      switch (params[0]) {
        case "title":
          slide_element.content = content[++i];
          //console.log(i);
          slide_element.type = "title";
          break;

        case "demo":
          slide_element.content = content[++i].trim();
          slide_element.link = params[1];
          slide_element.type = "demo";
          break;

        case "quiz":
          slide_element.content = content[++i].trim();
          slide_element.link = params[1];
          slide_element.type = "quiz";
          break;
        case "image":
          slide_element.content = content[++i].trim();
          slide_element.type = "image";
          slide_element.link = params[1];
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

  private readFile(url: string): Promise<string> {
    console.log(url);
    return this.http.get(url, { responseType: "text" }).toPromise();
  }

  constructor(private http: HttpClient) {}
}
