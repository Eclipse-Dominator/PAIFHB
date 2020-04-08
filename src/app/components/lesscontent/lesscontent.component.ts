import { Component, OnInit, Input } from '@angular/core';

import { LessonDataService, LessonData, LessonItem } from '../../services/lesson-data.service';

@Component({
  selector: 'app-lesscontent',
  templateUrl: './lesscontent.component.html',
  styleUrls: ['./lesscontent.component.scss'],
})
export class LesscontentComponent implements OnInit {
    content: string;
    content2: string = "<ion-text color='danger'>i am a butt</ion-text>";
    procContent: string[];
    
    constructor(
        private dataSvce: LessonDataService
    ) { }

  ngOnInit() {
      this.dataSvce.getSelectedContent().subscribe(
          x => {
              this.content = x;
              this.procContent = this.content.split('\n');
              for (let i = 0; i < this.procContent.length; i++) {
                  let line: string = this.procContent[i];
                  this.procContent[i] = line + "<br/>";
              }
              this.content = this.procContent.join('');
          },
        err => this.content = "not found"
      )
      
  }

}
