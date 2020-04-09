import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LessonSelectorPage } from "./lesson-selector.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [LessonSelectorPage],
})
export class LessonSelectorPageModule {}
