import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "add-content",
    loadChildren: () =>
      import("./pages/add-content/add-content.module").then(
        (m) => m.AddContentPageModule
      ),
  },
  {
    path: "edit-quiz",
    loadChildren: () =>
      import("./pages/add-content/add-content.module").then(
        (m) => m.AddContentPageModule
      ),
  },
  {
    path: "lesson",
    loadChildren: () =>
      import("./pages/lesson/lesson.module").then((m) => m.LessonPageModule),
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home-tab-container/home-tab-container.module").then(
        (m) => m.HomeTabContainerPageModule
      ),
  },
  {
    path: "quiz/:quizfolder",
    loadChildren: () =>
      import("./pages/lesson/lesson.module").then((m) => m.LessonPageModule),
  },
  {
    path: "",
    redirectTo: "add-content",
    pathMatch: "full",
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
