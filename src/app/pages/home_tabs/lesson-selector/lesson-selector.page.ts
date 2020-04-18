import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";

import { LessonDataService } from "../../../services/lesson-data.service";

import { LessonData, LessonItem } from "../../../services/interfaces";

@Component({
  selector: "app-lesson-selector",
  templateUrl: "./lesson-selector.page.html",
  styleUrls: ["./lesson-selector.page.scss"],
})
export class LessonSelectorPage implements OnInit {
  Title: string = "PAIF Handbook";

  constructor(
    private navCtrl: NavController,
    private dataSvce: LessonDataService
  ) {}

  GridData: LessonData[] = [];

  ngOnInit() {
    this.GridData = this.dataSvce.getAllLessonData();
  }

  lessonNav(lesson: LessonItem): void {
    // console.log(lesson.id);
    this.dataSvce.selectLesson(lesson);
    this.navCtrl.navigateForward("lesson");
  }
}
