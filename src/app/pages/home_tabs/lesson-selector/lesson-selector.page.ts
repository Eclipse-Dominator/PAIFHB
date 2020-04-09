import { Component } from "@angular/core";
import { NavController } from "@ionic/angular";

import {
  LessonDataService,
  LessonData,
  LessonItem,
} from "../../../services/lesson-data.service";

@Component({
  selector: "app-lesson-selector",
  templateUrl: "./lesson-selector.page.html",
  styleUrls: ["./lesson-selector.page.scss"],
})
export class LessonSelectorPage {
  Title: string = "PAIF Handbook";

  constructor(
    private navCtrl: NavController,
    private dataSvce: LessonDataService
  ) {}

  GridData: LessonData[] = this.dataSvce.getAllData();

  lessonNav(lesson: LessonItem): void {
    // console.log(lesson.id);
    this.dataSvce.selectLesson(lesson);
    this.navCtrl.navigateForward("lesson");
  }
}
