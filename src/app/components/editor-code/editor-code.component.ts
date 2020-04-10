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
  @Input() quizmode = false;
  @Input() demomode = false;

  templates: Language[];

  editorInput: EditorInputs = { ...this.defaultEditorInput };
  submitted: boolean = false;

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
    private cApi: CompilerApiService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  async ngOnInit() {
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
      this.editorInput;
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
  @ViewChild("slidesTag", { static: false }) slidesTag: IonSlides;

  async onSubmit(): Promise<void> {
    //console.log(this.editor);
    this.result.language = "";
    let tmp_input: string = "";
    if (this.editor.add_input) tmp_input = this.editor.code_input;

    try {
      this.submitted = true;
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
      this.getImptData(raw_response);
      this.submitted = false;
    } catch (error) {
      this.presentToast(error);
      //console.log(error);
      this.submitted = false;
    }
  }

  getImptData(data: Response): void {
    this.result.language = data.language;

    if (data.build_result === "failure") {
      this.result.stderr =
        "build exit code: " + data.build_exit_code + "\n" + data.build_stderr;
      this.result.stdout = data.build_stdout;
      this.result.result = false;
    } else {
      this.result.stdout = data.stdout;
      if (data.result === "failure") {
        this.result.stderr =
          "exit code: " + data.exit_code + "\n" + data.stderr;
        this.result.result = false;
      } else {
        this.result.stderr = data.stderr;
        this.result.result = true;
      }
    }
    console.log(this.result);
  }
}
