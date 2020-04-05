import { Component, OnInit } from '@angular/core';

import { LessonDataService, LessonData, LessonItem } from '../services/lesson-data.service';
import { LesscontentComponent } from '../lesscontent/lesscontent.component';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.page.html',
  styleUrls: ['./lesson.page.scss'],
})
export class LessonPage implements OnInit {

    lesson: LessonItem;
    contents: string;
    title: string;

    constructor(
        private dataSvce: LessonDataService
    ) { }

    ngOnInit() {
      // setup the lesson page
        this.lesson = this.dataSvce.getSelected();
        this.contents = this.lesson.icon;
        this.title = this.lesson.title;
    }

}
