import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CodeEditorPageRoutingModule } from "./code-editor-routing.module";

import { CodeEditorPage } from "./code-editor.page";

import { EditorCodeComponent } from "../../../components/editor-code/editor-code.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CodeEditorPageRoutingModule,
  ],
  declarations: [CodeEditorPage, EditorCodeComponent],
})
export class CodeEditorPageModule {}
