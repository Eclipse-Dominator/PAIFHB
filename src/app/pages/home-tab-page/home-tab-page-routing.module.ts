import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeTabPagePage } from "./home-tab-page.page";

const routes: Routes = [
  {
    path: "",
    component: HomeTabPagePage,
    children: [
      {
        path: "about",
        loadChildren: () =>
          import("../home_tabs/about-tab/about-tab.module").then(
            (m) => m.AboutTabPageModule
          ),
      },
      {
        path: "code-editor",
        loadChildren: () =>
          import("../home_tabs/code-editor/code-editor.module").then(
            (m) => m.CodeEditorPageModule
          ),
      },
      {
        path: "lesson-selector",
        loadChildren: () =>
          import("../home_tabs/lesson-selector/lesson-selector.module").then(
            (m) => m.LessonSelectorPageModule
          ),
      },
    ],
  },
  {
    path: "d",
    redirectTo: "/home/lesson-selector",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabPagePageRoutingModule {}
