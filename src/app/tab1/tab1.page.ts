import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

import { LessonDataService, LessonData, LessonItem } from '../services/lesson-data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
    Title: string = "Productivity At Its Finest";

    constructor(
        private navCtrl: NavController,
        private dataSvce: LessonDataService
    ) { }

    GridData: LessonData[] = this.dataSvce.getAllData();

    lessonNav(lesson:LessonItem):void {
        // console.log(lesson.id);
        this.dataSvce.selectLesson(lesson);
        this.navCtrl.navigateForward('lesson');
    }
}
