import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LessonPageRoutingModule } from "./lesson-routing.module";

import { LessonPage } from "./lesson.page";

import { LesscontentComponent } from "../../../components/lesscontent/lesscontent.component";
import { CodeEditorPageModule } from "../code-editor/code-editor.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonPageRoutingModule,
    CodeEditorPageModule,
  ],
  declarations: [LessonPage, LesscontentComponent],
})
export class LessonPageModule {}
