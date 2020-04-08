import { Component, OnInit, Input } from '@angular/core';

import { LessonDataService, LessonData, LessonItem } from '../../services/lesson-data.service';

@Component({
  selector: 'app-lesscontent',
  templateUrl: './lesscontent.component.html',
  styleUrls: ['./lesscontent.component.scss'],
})
export class LesscontentComponent implements OnInit {
    content: string;
    
    constructor(
        private dataSvce: LessonDataService
    ) { }

  ngOnInit() {
    this.dataSvce.getSelectedContent().subscribe(
      x => this.content = x,
      err => this.content = "not found"
    )
  }

}
