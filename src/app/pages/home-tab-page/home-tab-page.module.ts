import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { HomeTabPagePageRoutingModule } from "./home-tab-page-routing.module";

import { HomeTabPagePage } from "./home-tab-page.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTabPagePageRoutingModule,
  ],
  declarations: [HomeTabPagePage],
})
export class HomeTabPagePageModule {}
