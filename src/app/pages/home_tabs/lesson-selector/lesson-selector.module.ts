import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { LessonSelectorPageRoutingModule } from "./lesson-selector-routing.module";

import { LessonSelectorPage } from "./lesson-selector.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LessonSelectorPageRoutingModule,
  ],
  declarations: [LessonSelectorPage],
})
export class LessonSelectorPageModule {}
