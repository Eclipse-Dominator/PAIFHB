import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AboutTabPage } from "./about-tab.page";

const routes: Routes = [
  {
    path: "",
    component: AboutTabPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutTabPageRoutingModule {}
