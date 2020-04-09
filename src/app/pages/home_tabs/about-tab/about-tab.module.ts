import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AboutTabPage } from "./about-tab.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [AboutTabPage],
})
export class AboutTabPageModule {}
