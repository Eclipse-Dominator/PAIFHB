import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { NavController } from "@ionic/angular";
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

  @Output() emitDemo: EventEmitter<any> = new EventEmitter();
  @Output() emitProgress: EventEmitter<any> = new EventEmitter();

  constructor(
    private dataSvce: LessonDataService,
    private navCtrl: NavController
  ) {}

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    scrollbar: true,
    watchSlidesProgress: true,
  };

  async codeNav(url: string, type: string): Promise<void> {
    let file_url = this.dataSvce.getSelected().id + "/" + url;
    if (type == "quiz") {
      // TODO: fuck
    } else if (type == "demo") {
      this.emitDemo.emit(await this.dataSvce.getDemo(file_url));
    }
  }

  async ngOnInit(): Promise<void> {
    this.loaded = false;
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
  }
}
