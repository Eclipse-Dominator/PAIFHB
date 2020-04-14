import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LessonPageRoutingModule } from "./lesson-routing.module";

import { LessonPage } from "./lesson.page";

import { LesscontentComponent } from "../../components/lesscontent/lesscontent.component";
//import { CodeEditorPageModule } from "../home_tabs/code-editor/code-editor.module";
import { EditorCodeModule } from "../../components/editor-code/editor-code.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonPageRoutingModule,
    EditorCodeModule,
  ],
  declarations: [LessonPage, LesscontentComponent],
})
export class LessonPageModule {}
