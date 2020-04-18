import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  RawHTML,
  file_item,
  EditorInputs,
  RawSlide,
} from "../../services/interfaces";
import { LessonDataService } from "../../services/lesson-data.service";

@Component({
  selector: "app-edit-item-list",
  templateUrl: "./edit-item-list.component.html",
  styleUrls: ["./edit-item-list.component.scss"],
})
export class EditItemListComponent implements OnInit {
  constructor(private dataSvce: LessonDataService) {}
  @Input() inputItem: RawHTML = {
    type: "",
  };
  @Output() deleted: EventEmitter<any> = new EventEmitter();
  @Output() copied: EventEmitter<any> = new EventEmitter();
  @Output() demo: EventEmitter<any> = new EventEmitter();
  @Output() quiz: EventEmitter<any> = new EventEmitter();

  view_demo_details($event, demo_html: RawHTML) {
    if (!demo_html.link) return;
    console.log("demo");

    let ei: EditorInputs = {
      languages: [],
    };
    if (!demo_html.extrafile.length) {
      console.log(demo_html.extrafile.length);
      demo_html.extrafile.push({ name: demo_html.link, content: "" });
    }

    let file_content_obj: file_item = demo_html.extrafile[0];
    file_content_obj.name = demo_html.link;
    let file_content = file_content_obj.content;
    console.log(demo_html);
    ei = file_content ? this.dataSvce.parseCodeTxt(file_content) : ei;
    this.demo.emit(ei);
  }

  view_quiz_details($event, quiz_html: RawHTML) {
    if (!quiz_html.link) return;
    console.log("quiz");

    let ei: EditorInputs = {
      languages: [],
    };
    let slideContent: RawSlide[] = [];
    if (!quiz_html.extrafile.length) {
      console.log(quiz_html.extrafile.length);
      quiz_html.extrafile.push({ name: "content.txt", content: "" });
      quiz_html.extrafile.push({ name: "quiz.txt", content: "" });
    }
    let file_quiz_obj: file_item = quiz_html.extrafile.find(
      (x) => x.name == "quiz.txt"
    );
    let file_content_obj: file_item = quiz_html.extrafile.find(
      (x) => x.name == "content.txt"
    );
    console.log(quiz_html);
    ei = file_quiz_obj.content
      ? this.dataSvce.parseCodeTxt(file_quiz_obj.content)
      : ei;
    let file_content: string = file_content_obj.content;
    if (file_content) {
      let slidesGen = this.dataSvce.parseData(
        file_content_obj.content.split("\n")
      );
      for (let slide of slidesGen) {
        slideContent.push(slide);
      }
    }
    console.log([ei, slideContent]);
    this.quiz.emit([ei, slideContent]);
  }

  onDelete($event) {
    this.deleted.emit("deleted");
  }
  onCopy($event) {
    this.copied.emit("copied");
  }
  ngOnInit() {
    console.log(this.inputItem);
  }
}
