import { Component, OnInit, Input } from '@angular/core';

import { LessonDataService, LessonData, LessonItem } from '../../services/lesson-data.service';

@Component({
  selector: 'app-lesscontent',
  templateUrl: './lesscontent.component.html',
  styleUrls: ['./lesscontent.component.scss'],
})
export class LesscontentComponent implements OnInit {
    content: string;
    content1:string = "<ion-card>joke on u</ion-card>"

    constructor(
        private dataSvce: LessonDataService
    ) { }

  ngOnInit() {
    this.dataSvce.getSelectedContent()
    .then(x => this.content = x)
    .catch(err => this.content = "not found")
  }

}
