import { Component, OnInit, ViewChild } from "@angular/core";
import { NavController, IonSlides } from "@ionic/angular";

import {
  LessonDataService,
  LessonData,
  LessonItem,
  EditorInputs,
} from "../../../services/lesson-data.service";
import { EditorCodeComponent } from "../../../components/editor-code/editor-code.component";

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
  };

  async toggleCode() {
    if (this.is_on_code) {
      await this.slide_content.slidePrev();
    } else {
      await this.slide_content.slideNext();
    }
    this.is_on_code = !this.is_on_code;
  }

  demo(editorInput: EditorInputs): void {
    this.editorInputOptions = { ...editorInput };
    this.editorInputOptions.languages = editorInput.languages.map((x) => {
      return { ...x };
    });
    this.code_editor.ngOnInit();
    this.toggleCode();
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
