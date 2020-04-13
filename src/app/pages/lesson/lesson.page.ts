import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, IonSlides } from "@ionic/angular";

import {
  LessonDataService,
  LessonData,
  LessonItem,
  EditorInputs,
} from "../../services/lesson-data.service";
import { EditorCodeComponent } from "../../components/editor-code/editor-code.component";

@Component({
  selector: "app-lesson",
  templateUrl: "./lesson.page.html",
  styleUrls: ["./lesson.page.scss"],
})
export class LessonPage implements OnInit {
  @ViewChild("ionslides", { static: false }) slide_content: IonSlides;
  @ViewChild("code_editor", { static: false }) code_editor: EditorCodeComponent;
  lesson: LessonItem;
  contents: string;
  title: string;
  id: string;
  is_on_code: boolean = false;
  templates_loaded: boolean = false;
  current_slide: number = 0;
  code_slide: number = 0;

  editorInputOptions: EditorInputs = {
    input: "",
    quiz_input: "",
    quiz_output: "",
    languages: [],
  };
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    direction: "vertical",
    allowTouchMove: false,
    slidesPerView: 1,
    spaceBetween: 20,
  };

  getCurrentPage() {
    this.slide_content.getPreviousIndex();
  }

  codePageChange(page: number) {
    this.code_slide = page;
  }

  async toggleCode() {
    if (this.is_on_code) {
      await this.slide_content.slidePrev();
    } else {
      await this.slide_content.slideNext();
    }
    this.current_slide = await this.slide_content.getActiveIndex();
    this.is_on_code = !this.is_on_code;
  }

  clearEditor() {
    this.editorInputOptions = {
      input: "",
      quiz_input: "",
      quiz_output: "",
      languages: [],
    };
    this.code_editor.ngOnInit();
    this.templates_loaded = false;
  }

  updateEditor(
    editorInput: EditorInputs,
    autoscroll: boolean = false,
    quiz_mode: boolean = false
  ): void {
    console.log(quiz_mode, autoscroll);
    this.editorInputOptions = { ...editorInput };
    this.editorInputOptions.languages = editorInput.languages.map((x) => {
      return { ...x };
    });
    this.code_editor.ngOnInit();
    this.templates_loaded = true;
    if (autoscroll) this.toggleCode();
    if (quiz_mode) this.templates_loaded = false;
  }

  async toggleCodeEditor() {
    await this.code_editor.slidesTag.slidePrev();
  }

  constructor(
    private dataSvce: LessonDataService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    // setup the lesson page
    this.lesson = this.dataSvce.getSelected();
    if (this.lesson == undefined) this.navCtrl.navigateBack("");
  }
}
