import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import { RawSlide, RawHTML, EditorInputs } from "../../services/interfaces";
import {
  ActionSheetController,
  IonSlides,
  NavController,
  NavParams,
} from "@ionic/angular";
import { EditorCodeComponent } from "../../components/editor-code/editor-code.component";
import { LessonDataService } from "../../services/lesson-data.service";
import { NavigationExtras, ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "app-add-content",
  templateUrl: "./add-content.page.html",
  styleUrls: ["./add-content.page.scss"],
})
export class AddContentPage implements AfterViewInit {
  constructor(
    private actionSheetController: ActionSheetController,
    private dataSvce: LessonDataService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) {
    // get passed objects if any
    this.route.queryParams.subscribe((params) => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.navParams = this.router.getCurrentNavigation().extras.state;

        this.pageList = this.navParams.slideDetail;
        if (this.navParams.quizEditor) this.quizEditor = true;
      } else {
        // u shouldnt be on this page
        this.navCtrl.navigateRoot("");
      }
    });
  }

  @ViewChild("code_editor", { static: false }) code_editor: EditorCodeComponent;
  @ViewChild("ionslides", { static: false }) ionSlides: IonSlides;
  navParams: NavigationExtras["state"];
  copiedItem: RawHTML;
  copiedPage: RawSlide;
  pageList: RawSlide[] = [];
  quizEditor: boolean = false;
  onEditor: boolean = false;

  private codeEditorObject: RawHTML;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    direction: "vertical",
    allowTouchMove: false,
    slidesPerView: 1,
    spaceBetween: 20,
  };

  async ngAfterViewInit() {
    // ei and slideDetail are derived objects from rootObj
    // so they do not contain reference to rootObj!
    if (this.navParams && this.navParams.ei) {
      console.log(this.navParams.ei);
      this.code_editor.defaultEditorInput = this.navParams.ei;
      await this.code_editor.ngOnInit();
    }
  }
  view_demo_details(e) {
    console.log("demo");
  }
  view_quiz_details(e) {
    console.log("quiz");
  }
  async toggleCode() {
    if (this.onEditor) {
      await this.ionSlides.slidePrev();
    } else {
      await this.ionSlides.slideNext();
    }
    this.onEditor = !this.onEditor;
  }
  doReorderChild(e, page) {
    page.content = e.detail.complete(page.content);
    console.log(page);
  }
  doReorderPage(e) {
    this.pageList = e.detail.complete(this.pageList);
    console.log(this.pageList);
  }
  deleteItem(e, item: RawHTML, page: RawSlide) {
    console.log("delete");
    page.content = page.content.filter((x) => x != item);
  }
  copyItem(e, item: RawHTML) {
    console.log("copy");
    this.copiedItem = this.duplicateItem(item);
  }
  pasteItem(page: RawSlide) {
    console.log("paste");
    page.content.push({ ...this.copiedItem });
  }

  add_new_page(
    page: RawSlide = { content: [], name: "Page " + (this.pageList.length + 1) }
  ) {
    this.pageList.push(page);
  }

  duplicateItem(item: RawHTML): RawHTML {
    let dup: RawHTML = { ...item };
    if (item.extrafile) {
      dup.extrafile = item.extrafile.map((x) => {
        return { ...x };
      });
    }
    return dup;
  }

  duplicatePage(page: RawSlide): RawSlide {
    let pagecopy: RawSlide = { ...page };
    pagecopy.content = page.content.map(this.duplicateItem);
    return pagecopy;
  }

  async pageAction(page: RawSlide) {
    let pageActionOptions = {
      header: "Edit Page",
      buttons: [
        {
          text: "Delete Page",
          role: "destructive",
          icon: "trash",
          handler: () => {
            console.log("delete page");
            this.pageList = this.pageList.filter((x) => x != page);
          },
        },
        {
          text: "Copy Page",
          icon: "copy",
          handler: () => {
            console.log("Copy Page");
            this.copiedPage = this.duplicatePage(page);
          },
        },
        {
          text: "Add item",
          icon: "add",
          handler: () => {
            console.log("Copy Page");
            this.addItemToPage(page);
          },
        },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
        },
      ],
    };
    const actionSheet = await this.actionSheetController.create(
      pageActionOptions
    );
    await actionSheet.present();
  }

  async addItemToPage(page: RawSlide) {
    let itemsOptions = {
      header: "Add item to page",
      buttons: [
        {
          text: "Title",
          handler: () => {
            console.log("Add Title");
            page.content.push({ type: "title" });
          },
        },
        {
          text: "Paragraph",
          handler: () => {
            console.log("Add P");
            page.content.push({ type: "p" });
          },
        },

        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
        },
      ],
    };
    if (!this.quizEditor) {
      const [demo_btn, quiz_btn] = [
        {
          text: "Demo Button",
          handler: () => {
            console.log("Add demo");
            page.content.push({ type: "demo", link: "", extrafile: [] });
          },
        },
        {
          text: "Quiz Button",
          handler: () => {
            console.log("Add quiz");
            page.content.push({ type: "quiz", link: "", extrafile: [] });
          },
        },
      ];
      itemsOptions.buttons.push(demo_btn, quiz_btn);
    }
    if (this.copiedItem) {
      let pasteItemOption: any = {
        text: "Paste Item",
        icon: "clipboard",
        handler: () => {
          this.pasteItem(page);
        },
      };
      itemsOptions.buttons.push(pasteItemOption);
    }
    let actionSheet = await this.actionSheetController.create(itemsOptions);
    await actionSheet.present();
  }
  async enterCodePage(ei: EditorInputs, item: RawHTML): Promise<void> {
    console.log(ei, item);
    this.code_editor.defaultEditorInput = ei;
    await this.code_editor.ngOnInit();
    this.onEditor = true;
    this.codeEditorObject = item;
    await this.ionSlides.slideNext();
    console.log(this.onEditor);
  }

  async enterQuizPage(
    quizDetail: [EditorInputs, RawSlide[]],
    item: RawHTML
  ): Promise<void> {
    let navContent: NavigationExtras = {
      state: {
        ei: quizDetail[0],
        slideDetail: quizDetail[1],
        rootObj: item,
        quizEditor: true,
      },
    };
    this.navCtrl.navigateForward("/edit-quiz", navContent);
  }

  async cancel_editor($event): Promise<void> {
    this.code_editor.defaultEditorInput = {
      languages: [],
    };
    await this.code_editor.ngOnInit();
    await this.ionSlides.slidePrev();
    this.onEditor = false;
  }

  async export_editor(e): Promise<void> {
    let result: any = await this.code_editor.export_data(this.quizEditor);
    console.log(result);
    if (result) {
      let content_str: string = this.dataSvce.reverseParseCode(result);
      console.log(content_str);
      await this.ionSlides.slidePrev();
      this.onEditor = false;
      this.codeEditorObject.extrafile[0] = {
        name: this.codeEditorObject.link,
        content: content_str,
      };
      this.codeEditorObject = undefined;
    }
  }
}
