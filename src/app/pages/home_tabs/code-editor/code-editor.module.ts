import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CodeEditorPageRoutingModule } from "./code-editor-routing.module";

import { CodeEditorPage } from "./code-editor.page";

import { EditorCodeModule } from "../../../components/editor-code/editor-code.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodeEditorPageRoutingModule,
    EditorCodeModule,
  ],
  declarations: [CodeEditorPage],
})
export class CodeEditorPageModule {}
