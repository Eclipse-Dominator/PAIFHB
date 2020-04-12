import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { NavController, IonSlides } from "@ionic/angular";
import {
  LessonDataService,
  RawSlide,
} from "../../services/lesson-data.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-lesscontent",
  templateUrl: "./lesscontent.component.html",
  styleUrls: ["./lesscontent.component.scss"],
})
export class LesscontentComponent implements OnInit {
  slides: RawSlide[] = [];
  loaded: boolean = false;
  read_progress: number = 0;
  total_page: number = 0;

  @Output() emitQuiz: EventEmitter<any> = new EventEmitter();
  @Output() emitDemo: EventEmitter<any> = new EventEmitter();
  @Output() emitProgress: EventEmitter<any> = new EventEmitter();

  @ViewChild("ionslides", { static: false }) ionSlides: IonSlides;

  constructor(
    private route: ActivatedRoute,
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
      this.navCtrl.navigateForward("quiz/" + url);
    } else if (type == "demo") {
      this.emitDemo.emit(await this.dataSvce.loadEditor(file_url));
    }
  }

  async updateProgress(): Promise<void> {
    let current_page: number = 1 + (await this.ionSlides.getActiveIndex());
    console.log(current_page, this.total_page);
    this.read_progress = this.total_page ? current_page / this.total_page : 0;
  }

  async ngOnInit() {
    let quizID: string = this.route.snapshot.paramMap.get("quizfolder");
    this.loaded = false;
    let content_generator;
    if (quizID) {
      let file_url = this.dataSvce.getSelected().id + "/" + quizID;
      this.emitQuiz.emit(await this.dataSvce.loadEditor(file_url, true));
      content_generator = this.dataSvce.getSelectedContent(quizID);
    } else {
      content_generator = this.dataSvce.getSelectedContent();
    }

    try {
      for await (let slide of content_generator) {
        this.total_page += 1;
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
    this.updateProgress();
  }
}
