import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { HomeTabContainerPage } from "./home-tab-container.page";

const routes: Routes = [
  {
    path: "",
    component: HomeTabContainerPage,
    children: [
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
        path: "lessons-overview",
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
        path: "lessons",
        children: [
          {
            path: "",
            loadChildren: () =>
              import("../lesson/lesson.module").then((m) => m.LessonPageModule),
          },
        ],
      },
      {
        path: "",
        redirectTo: "/home/lessons-overview",
        pathMatch: "full",
      },
    ],
  },
  {
    path: "",
    redirectTo: "/home/lessons-overview",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeTabContainerPageRoutingModule {}
