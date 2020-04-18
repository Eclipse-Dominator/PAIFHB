import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CodeEditorPage } from "./code-editor.page";

const routes: Routes = [
  {
    path: "",
    component: CodeEditorPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CodeEditorPageRoutingModule {}
