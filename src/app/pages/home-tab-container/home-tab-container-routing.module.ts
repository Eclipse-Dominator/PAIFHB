import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeTabContainerPage } from "./home-tab-container.page";

const routes: Routes = [
  {
    path: "",
    component: HomeTabContainerPage,
    children: [
      {
        path: "about-tab",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../home_tabs/about-tab/about-tab.module").then(
                (m) => m.AboutTabPageModule
              ),
          },
        ],
      },
      {
        path: "code-editor",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../home_tabs/code-editor/code-editor.module").then(
                (m) => m.CodeEditorPageModule
              ),
          },
        ],
      },
      {
        path: "lessons",
        children: [
          {
            path: "",
            loadChildren: () =>
              import(
                "../home_tabs/lesson-selector/lesson-selector.module"
              ).then((m) => m.LessonSelectorPageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/home/about-tab",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/home/about-tab",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabContainerPageRoutingModule {}
