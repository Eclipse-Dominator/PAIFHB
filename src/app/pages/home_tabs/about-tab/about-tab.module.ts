import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AboutTabPageRoutingModule } from "./about-tab-routing.module";

import { AboutTabPage } from "./about-tab.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, AboutTabPageRoutingModule],
  declarations: [AboutTabPage],
})
export class AboutTabPageModule {}
