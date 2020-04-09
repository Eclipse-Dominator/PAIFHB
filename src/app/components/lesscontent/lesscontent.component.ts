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
      this.dataSvce.getDemo(file_url).then((x) => console.log(x));
    }
  }

  ngOnInit() {
    this.loaded = false;
    (async () => {
      let content_generator = this.dataSvce.getSelectedContent();
      try {
        for await (let slide of content_generator) {
          this.slides.push(slide);
        }
      } catch (error) {
        this.slides.push({
          content: [
            {
              type: "p",
              link: "",
              content: "An error has occured while loading this page!",
              style: "",
            },
          ],
        });
      }
      this.loaded = true;
    })();
  }
}
