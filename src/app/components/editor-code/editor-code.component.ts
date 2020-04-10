import { Component, OnInit, ViewChild, Input } from "@angular/core";
import {
  CompilerApiService,
  Response,
  FilteredResponse,
} from "../../services/compiler-api.service";
import {
  LoadingController,
  IonSlides,
  IonSelect,
  ToastController,
} from "@ionic/angular";
import { EditorInputs, Language } from "../../services/lesson-data.service";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: "app-editor-code",
  templateUrl: "./editor-code.component.html",
  styleUrls: ["./editor-code.component.scss"],
})
export class EditorCodeComponent implements OnInit {
  @ViewChild("ionSelect", { static: false }) ionSelect: IonSelect;

  @Input() defaultEditorInput: EditorInputs = {
    input: "",
    quiz_input: "",
    quiz_output: "",
    languages: [],
  };
  quizmode = false;
  @Input() demomode = false;

  templates: Language[];

  editorInput: EditorInputs = { ...this.defaultEditorInput };
    submitted: boolean = false;
    submittedQuiz: boolean = false;

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

  caps_first_word(x: string) {
    return x[0].toUpperCase() + x.slice(1);
  }

  onSelectChange(): void {
    let search_lang: string = this.editor.compiler;
    for (let i of this.editorInput.languages) {
      if (i.language == search_lang) {
        this.editor.code_content = i.code;

        return;
      }
    }
    if (this.quizmode || this.demomode)
      this.presentToast("No demo code available! :(");
    this.editorInput.languages.push({
      language: search_lang,
      code: "",
    });
    this.editor.code_content = "";
  }

  onCodeUpdate(): void {
    let search_lang: string = this.editor.compiler;

    for (let i in this.editorInput.languages) {
      if (this.editorInput.languages[i].language == search_lang) {
        this.editorInput.languages[i].code = this.editor.code_content;
        if (this.editorInput.languages[i].code != this.templates[i].code) {
          this.editorInput.languages[i].language =
            this.templates[i].language + "  📝";
          this.editor.compiler = this.editorInput.languages[i].language;
        }

        return;
      }
    }
    this.presentToast("No such language found");
  }

  async presentToast(msg: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

    constructor(
        private route: ActivatedRoute,
    private cApi: CompilerApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

    async ngOnInit() {
        this.quizmode = this.route.snapshot.paramMap.get('quizfolder') != null;
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
      add_input: this.editorInput.input == "" ? false : true,
      code_input: this.editorInput.input,
      compiler:
        this.defaultEditorInput.languages.length > 0
          ? this.defaultEditorInput.languages[0].language + "  📄"
          : "python3",
      code_content: "",
    };
    this.onSelectChange();
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
      add_input: this.editorInput.input == "" ? false : true,
      code_input: this.editorInput.input,
      compiler:
        this.defaultEditorInput.languages.length > 0
          ? this.defaultEditorInput.languages[0].language + "  📄"
          : "python3",
      code_content: "",
    };
    this.onSelectChange();
  }

    updateSubmit(quizMode: boolean, value: boolean) {
        if (quizMode) this.submittedQuiz = value;
        else this.submitted = value;
    }

  @ViewChild("slidesTag", { static: false }) slidesTag: IonSlides;
    
  async onSubmit(quizMode: boolean = false): Promise<void> {
    //console.log(this.editor);
    this.result.language = "";
      let qi = this.defaultEditorInput.quiz_input;
      let ei = this.editor.add_input;
      let tmp_input: string = (quizMode && qi) ? qi
                            : ei ? this.editor.code_input : "";

    try {
        this.updateSubmit(quizMode, true);
      let dataID: string = (
        await this.cApi.compile_code(
          this.editor.code_content,
          tmp_input,
          this.editor.compiler.replace("📝", "").replace("📄", "").trim()
        )
      ).id;
      this.slidesTag.slideNext();
      let result_generator = this.cApi.continued_query(dataID, 5);
      let raw_response;
      for await (raw_response of result_generator) {
        this.presentToast(
          typeof raw_response == "object" ? "retrieved" : raw_response
        );
        //console.log(await raw_response);
        }
        this.getImptData(raw_response, this.result, quizMode);
        this.updateSubmit(quizMode, false);
    } catch (error) {
      this.presentToast(error);
      //console.log(error);
        this.updateSubmit(quizMode, false);
    }
    }

    thoroughTrim(str: string) {
        let stra: string[] = str.split('\n');
        let i = 0;
        for (let line of stra) {
            stra[i++] = line.trim();
        }
        return stra.join('\n');
    }

  getImptData(data: Response, result: FilteredResponse, quizMode: boolean): void {
    result.language = data.language;

    if (data.build_result === "failure") {
      result.stderr = quizMode ? "build error when compiling code" :
        "build exit code: " + data.build_exit_code + "\n" + data.build_stderr;
      result.stdout = data.build_stdout;
      result.result = false;
    } else {
      result.stdout = data.stdout;
        if (data.result === "failure") {
            result.stderr = quizMode ? "an error occurred when running the code." :
                "exit code: " + data.exit_code + "\n" + data.stderr;
            result.result = false;
        } else if (quizMode) {
            if (this.thoroughTrim(this.defaultEditorInput.quiz_output.trim()) != this.thoroughTrim(result.stdout.trim())) {
                result.stdout = "";
                result.stderr = "wrong answer.";
                result.result = false;
            } else {
                result.stdout = "correct answer.";
                result.result = true;
            }
        } else {
        result.stderr = data.stderr;
        result.result = true;
      }
    }
    console.log(result);
  }
}
