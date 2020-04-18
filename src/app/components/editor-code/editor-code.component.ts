import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
} from "@angular/core";
import { CompilerApiService } from "../../services/compiler-api.service";
import {
  LoadingController,
  IonSlides,
  IonSelect,
  ToastController,
} from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import {
  Response,
  FilteredResponse,
  EditorInputs,
  Language,
} from "../../services/interfaces";

@Component({
  selector: "app-editor-code",
  templateUrl: "./editor-code.component.html",
  styleUrls: ["./editor-code.component.scss"],
})
export class EditorCodeComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private cApi: CompilerApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  @ViewChild("ionSelect", { static: false }) ionSelect: IonSelect;
  @ViewChild("slidesTag", { static: false }) slidesTag: IonSlides;

  @Input() defaultEditorInput: EditorInputs = {
    input: "",
    quiz_input: "",
    quiz_output: "",
    languages: [],
  };
  @Input() quizmode: boolean = false;
  @Output() pageChange: EventEmitter<any> = new EventEmitter();
  @Output() export_code: EventEmitter<any> = new EventEmitter();
  @Output() export_IO: EventEmitter<any> = new EventEmitter();

  templates: Language[];
  editorInput: EditorInputs = { ...this.defaultEditorInput };
  submitted: boolean = false;
  quiz_submitted: boolean = false;
  quiz_result: boolean = false;
  current_selected_language_index: number = 0;

  result: FilteredResponse = {
    language: "",
    stdout: "",
    stderr: "",
    time: "",
    result: true,
  };

  editor = {
    add_input: false,
    code_input: "",
    compiler: "",
    code_content: "",
  };

  public async export_data(
    IOoutput: boolean = false
  ): Promise<EditorInputs | boolean> {
    // export input and code
    let changedCode: Language[] = [];
    for (let lang of this.editorInput.languages) {
      if (lang.language.indexOf("📝") != -1) {
        changedCode.push({
          language: lang.language.replace("📝", "").replace("📄", "").trim(),
          code: lang.code,
        });
      }
    }
    let tmp_in: string = this.editor.add_input ? this.editor.code_input : "";
    if (!IOoutput)
      return {
        input: tmp_in,
        languages: changedCode,
      };

    let result_generator = await this.compileCode(
      changedCode[0].code,
      this.editorInput.input,
      changedCode[0].language
    );
    let raw_response;
    for await (raw_response of result_generator) {
      this.presentToast(
        typeof raw_response == "object" ? "retrieved" : raw_response
      );
    }
    let filteredResult: FilteredResponse;
    filteredResult = this.getImptData(raw_response, filteredResult);
    if (filteredResult.result)
      return {
        input: "",
        quiz_output: filteredResult.stdout,
        quiz_input: tmp_in,
        languages: changedCode,
      };
    else {
      this.presentToast("An error occured when runnning code!");
      return false;
    }
  }

  onSelectChange(): void {
    let search_lang: string = this.editor.compiler;

    for (let i in this.editorInput.languages) {
      if (this.editorInput.languages[i].language == search_lang) {
        this.editor.code_content = this.editorInput.languages[i].code;
        this.current_selected_language_index = +i;
        return;
      }
    }
    this.editorInput.languages.push({
      language: search_lang,
      code: "",
    });
    this.editor.code_content = "";
  }

  onCodeUpdate(): void {
    let i = this.current_selected_language_index;
    this.editorInput.languages[i].code = this.editor.code_content;
    if (this.editorInput.languages[i].code != this.templates[i].code) {
      this.editorInput.languages[i].language =
        this.templates[i].language + "  📝";
      this.editor.compiler = this.editorInput.languages[i].language;
    }

    return;
  }

  async presentToast(msg: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  async reset(): Promise<void> {
    if (this.templates.length == 0) {
      return this.ngOnInit();
    }
    this.editorInput = { ...this.defaultEditorInput };
    this.editorInput.languages = this.templates.map((x) => {
      return { ...x };
    });
    this.editor = {
      add_input: this.editorInput.input ? true : false,
      code_input: this.editorInput.input,
      compiler:
        this.defaultEditorInput.languages.length > 0
          ? this.defaultEditorInput.languages[0].language + "  📄"
          : "python3",
      code_content: "",
    };
    this.onSelectChange();
  }

  async onSlideChange(): Promise<void> {
    let current_slides = await this.slidesTag.getActiveIndex();
    this.pageChange.emit(current_slides);
  }

  async onSubmit(quizMode: boolean = false): Promise<void> {
    //console.log(this.editor);
    this.result.language = "";
    let qi = this.defaultEditorInput.quiz_input;
    let ei = this.editor.add_input;
    let tmp_input: string =
      quizMode && qi ? qi : ei ? this.editor.code_input : "";
    this.submitted = true;
    this.quiz_submitted = quizMode;

    let raw_response;
    let result_generator = await this.compileCode(
      this.editor.code_content,
      tmp_input,
      this.editor.compiler.replace("📝", "").replace("📄", "").trim()
    );
    await this.slidesTag.slideNext();

    for await (raw_response of result_generator) {
      this.presentToast(
        typeof raw_response == "object" ? "retrieved" : raw_response
      );
      // console.log(await raw_response);
    }

    this.getImptData(raw_response, this.result, quizMode);
    this.submitted = false;
  }

  async compileCode(
    code: string,
    user_input: string,
    compiler: string
  ): Promise<any> {
    try {
      let dataID: string = (
        await this.cApi.compile_code(code, user_input, compiler)
      ).id;

      //let dataID: string = this.default_result.id;

      return this.cApi.continued_query(dataID, 5);
    } catch (error) {
      this.presentToast(error);
      //console.log(error);
    }
  }

  thoroughTrim(str: string) {
    let stra: string[] = str.trim().split("\n");
    let i = 0;
    for (let line of stra) {
      stra[i++] = line.trim();
    }
    console.log(stra);
    return stra.join("\n");
  }

  getImptData(
    data: Response,
    result: FilteredResponse,
    quizMode: boolean = false
  ): FilteredResponse {
    result.language = data.language;

    if (data.build_result === "failure") {
      result.stderr =
        "build exit code: " + data.build_exit_code + "\n" + data.build_stderr;
      result.stdout = data.build_stdout;
      result.result = false;
    } else {
      result.stdout = data.stdout;
      if (data.result === "failure" || data.stderr != "") {
        result.stderr = "exit code: " + data.exit_code + "\n" + data.stderr;
        result.result = false;
      } else {
        result.stderr = data.stderr;
        result.result = true;
      }
    }

    result.stderr =
      quizMode && !result.result ? "error compiling/running" : result.stderr;

    result.stdout =
      quizMode && result.result
        ? this.ValidateAns(result.stdout, this.defaultEditorInput.quiz_output)
          ? "Correct!"
          : "Wrong!"
        : result.stdout;
    console.log(result);
    return result;
  }

  ValidateAns(result: string, ans: string): Boolean {
    this.quiz_result = this.thoroughTrim(result) == this.thoroughTrim(ans);
    return this.quiz_result;
  }

  async ngOnInit() {
    // Runs on init
    this.quizmode = this.route.snapshot.paramMap.get("quizfolder") != null;
    try {
      this.templates = (await this.cApi.getTemplateJSON()).languages;
      let i = -1,
        j = 0;
      while (
        ++i < this.templates.length &&
        j < this.defaultEditorInput.languages.length
      ) {
        if (
          this.templates[i].language ==
          this.defaultEditorInput.languages[j].language
        ) {
          this.templates[i].language =
            this.defaultEditorInput.languages[j].language + "  📄";
          this.templates[i].code = this.defaultEditorInput.languages[j].code;
          j++;
        }
      }

      this.editorInput = { ...this.defaultEditorInput };
      this.editorInput.languages = this.templates.map((x) => {
        return { ...x };
      });
    } catch (error) {
      this.presentToast("An error occured while loading templates!");
      this.editorInput = { ...this.defaultEditorInput };
      this.editorInput.languages = this.defaultEditorInput.languages.map(
        (x) => {
          return { ...x };
        }
      );
    }

    this.editor = {
      add_input: this.editorInput.input ? true : false,
      code_input: this.editorInput.input,
      compiler:
        this.defaultEditorInput.languages.length > 0
          ? this.defaultEditorInput.languages[0].language + "  📄"
          : "python3",
      code_content: "",
    };
    this.onSelectChange();
  }
}
