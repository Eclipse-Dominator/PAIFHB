import { Injectable } from "@angular/core";
//import { HTTP } from '@ionic-native/http/ngx/'; // mobile
import { HttpClient } from "@angular/common/http";
import { LessonDataService } from "./lesson-data.service";
import { Response, FilteredResponse, IncompleteResponse } from "./interfaces";

@Injectable({
  providedIn: "root",
})
export class CompilerApiService {
  compilers_lang: string[] = [
    "c",
    "cpp",
    "objective-c",
    "java",
    //"kotlin",
    //"scala",
    "swift",
    "csharp",
    //"go",
    "haskell",
    //"erlang",
    "perl",
    "python",
    "python3",
    "ruby",
    "php",
    "bash",
    //"r",
    //"javascript",
    //"coffeescript",
    "vb",
    //"cobol",
    //"fsharp",
    //"d",
    //"clojure",
    //"elixir",
    "mysql",
    //"rust",
    //"scheme",
    //"commonlisp",
    //"plain",
  ];
  apiUrl: string = "http://api.paiza.io:80";
  headers = {
    "Content-Type": "application/json",
  };
  post_session: string = "/runners/create";
  get_status: string = "/runners/get_status";
  get_details: string = "/runners/get_details";

  constructor(
    //private http:HTTP,
    private dataSvce: LessonDataService,
    private http: HttpClient
  ) {}

  public async getTemplateJSON() {
    return await this.dataSvce.getCodeTemplates();
  }

  async compile_code(
    content: string,
    user_input: string,
    compiler: string
  ): Promise<IncompleteResponse> {
    let body = {
      language: compiler,
      source_code: content,
      input: user_input,
      api_key: "guest",
    };

    console.log(body);
    return await this.http
      .post<IncompleteResponse>(this.apiUrl + this.post_session, body)
      .toPromise();
  }

  check_completion(id: string) {
    let body = {
      id: id,
      api_key: "guest",
    };
    let addon: string = "?id=" + id + "&api_key=guest";
    return new Promise((resolve, reject) => {
      this.http
        .get<IncompleteResponse>(this.apiUrl + this.get_status + addon)
        .subscribe(
          (data) => {
            console.log(data);
            resolve(data);
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  async get_result(id: string) {
    console.log("getting result");
    let addon: string = "?id=" + id + "&api_key=guest";
    try {
      return await this.http
        .get<Response>(this.apiUrl + this.get_details + addon)
        .toPromise();
    } catch (error) {
      return Promise.reject(
        new Error("An error occured when fetching the result")
      );
    }
  }

  timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  async *continued_query(id: string, tries: number) {
    let result: any;
    while (tries-- > 0) {
      console.log(tries);
      result = await this.check_completion(id);
      if (result.status == "completed") {
        yield "Compiled! Retrieving data...";
        yield await this.get_result(id);
        return;
      }
      yield "Not compiled! " + tries + " left...";
      await this.timeout(1000);
    }
    return Promise.reject(new Error("Timed out!"));
  }
}
