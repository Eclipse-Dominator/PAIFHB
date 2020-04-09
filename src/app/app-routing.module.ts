import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("./tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  {
    path: "lesson",
    loadChildren: () =>
      import("./lesson/lesson.module").then((m) => m.LessonPageModule),
  },
  {
    path: "home",
    loadChildren: () =>
      import("./pages/home-tab-page/home-tab-page.module").then(
        (m) => m.HomeTabPagePageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
