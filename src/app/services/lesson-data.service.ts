import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import data from "../../assets/content/lesson_data.json";
//import { HTTP } from '@ionic-native/http/ngx/'; // mobile

// Handles data state

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

/* Confused noises */
@Injectable({
  providedIn: "root",
})
export class LessonDataService {
  private rawData: LessonData[] = data;

  private selectedData: LessonItem; // controls state of lesson page

  // for quiz and try
  private defaultStdin: string = "";
  private defaultCode: string[] = ["", "", ""];
  private questionText: string;

  public getStdin(): string {
    return this.defaultStdin;
  }

  public async getDemo(url: string): Promise<any> {
    let file_url: string = "../assets/content/" + url;
    let rawCode: string = await this.readFile(file_url);
    console.log(this.parseCodeTxt(rawCode));
    console.log(JSON.parse(this.parseCodeTxt(rawCode)));
  }

  public getQuiz(): string {
    return this.questionText;
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

  public parseCodeTxt(rawString: string) {
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
    return "{\n" + jsonArray.join(",") + "\n}";
  }

  public getAllData(): LessonData[] {
    console.log(this.rawData);
    return this.rawData;
  }

  public selectLesson(lesson: LessonItem): void {
    this.selectedData = lesson;
  }

  public getSelected(): LessonItem {
    return this.selectedData;
  }

  public async *getSelectedContent() {
    let url = "../assets/content/" + this.selectedData.id + "/";

    let content: string[] = (await this.readFile(url + "content")).split("\n");
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
        yield { ...current_page };
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
    return this.http.get(url, { responseType: "text" }).toPromise();
  }

  constructor(private http: HttpClient) {}
}
