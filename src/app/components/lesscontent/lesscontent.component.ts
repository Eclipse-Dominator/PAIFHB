import { Component, OnInit, Input } from "@angular/core";

import {
  LessonDataService,
  RawSlide,
} from "../../services/lesson-data.service";

@Component({
  selector: "app-lesscontent",
  templateUrl: "./lesscontent.component.html",
  styleUrls: ["./lesscontent.component.scss"],
})
export class LesscontentComponent implements OnInit {
  slides: RawSlide[] = [];
  loaded: boolean = false;
  constructor(private dataSvce: LessonDataService) {}

  slideOpts = {
    initialSlide: 0,
    speed: 400,
  };

  codeNav(url: string, type: string): void {
    let file_url = this.dataSvce.getSelected().id + "/" + url;
    if (type == "quiz") {
      // TODO: fuck
    } else if (type == "demo") {
      this.dataSvce
        .getDemo(file_url)
        .then((x) => console.log(JSON.stringify(x)));
    }
  }

  ngOnInit() {
    this.loaded = false;
    (async () => {
      console.log("running");
      let content_generator = this.dataSvce.getSelectedContent();
      for await (let slide of content_generator) {
        this.slides.push(slide);
      }
      console.log(this.slides);
      console.log(content_generator);
      this.loaded = true;
    })();
  }
}
