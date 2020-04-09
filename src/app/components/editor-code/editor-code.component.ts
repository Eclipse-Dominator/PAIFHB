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

  editorInput: EditorInputs;
  submitted: boolean = false;

  result: FilteredResponse = {
    language: "",
    stdout: "",
    stderr: "",
    time: "",
    result: true,
  };
  editor;

  onSelectChange(): void {
    let search_lang: string = this.editor.compiler;
    for (let language of this.editorInput.languages) {
      console.log(language.language, search_lang);
      if (language.language == search_lang) {
        console.log("found");
        this.editor.code_content = language.code;
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
    console.log(this.editorInput);
  }

  onCodeUpdate(): void {
    console.log("codeChange");
    let search_lang: string = this.editor.compiler;
    for (let language of this.editorInput.languages) {
      if (language.language == search_lang) {
        language.code = this.editor.code_content;
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

  ngOnInit() {
    this.editorInput = { ...this.defaultEditorInput };
    this.editorInput.languages = [...this.defaultEditorInput.languages];
    this.editor = {
      add_input: this.editorInput.input == "" ? false : true,
      code_input: this.editorInput.input,
      compiler:
        this.editorInput.languages.length > 0
          ? this.editorInput.languages[0].language
          : "python3",
      code_content: "",
    };
    this.onSelectChange();
  }
  @ViewChild("slidesTag", { static: false }) slidesTag: IonSlides;

  onSubmit(): void {
    //console.log(this.editor);
    this.result.language = "";
    let tmp_input: string = "";
    if (this.editor.add_input) tmp_input = this.editor.code_input;

    this.submitted = true;

    this.cApi
      .compile_code(this.editor.code_content, tmp_input, this.editor.compiler)
      .then((data: any) => {
        this.slidesTag.slideNext();
        return this.cApi.continued_query(data.id, 5);
      })
      .then((result) => {
        console.log(result);
        this.getImptData(result);
        this.submitted = false;
      })
      .catch((error) => {
        console.log(error);
        this.submitted = false;
      });
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
