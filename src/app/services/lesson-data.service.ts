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

  public getCode(): string[] {
    return this.defaultCode;
  }

  public getQuiz(): string {
    return this.questionText;
  }

  public async parseTryTxt(link) {
    let url = "../assets/content/" + this.selectedData.id + "/" + link + ".txt";

    let rawText: string[] = (await this.readFile(url)).split("\n");

    // reset values to prevent accumulation
    this.defaultStdin = "";
    this.defaultCode = ["", "", ""];

    let mode = -1; // 0 - input, 1 - c++, 2 - python, 3 - c

    for (let line in rawText) {
      if (line.slice(0, 2) == "--") {
        mode++;
        continue;
      }
      if (mode == 0) this.defaultStdin += line + "\n";
      else this.defaultCode[mode - 1] += line + "\n";
    }
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
    let url = "../assets/content/" + this.selectedData.id + "/content.txt";

    let content: string[] = (await this.readFile(url)).split("\n");
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

        case "<-- try -->":
          slide_element.link = content[++i];
          for (j = 10; j < slide_element.link.length; j++)
            if (slide_element.link[j] == " ") break;
          slide_element.link = slide_element.link.slice(4, j);
          //console.log(slide_element.link);
          slide_element.type = "try";
          break;

        case "<-- quiz -->":
          slide_element.link = content[++i];
          for (j = 11; j < slide_element.link.length; j++)
            if (slide_element.link[j] == " ") break;
          slide_element.link = slide_element.link.slice(4, j);
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
