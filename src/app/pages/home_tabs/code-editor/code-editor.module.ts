import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { CodeEditorPage } from "./code-editor.page";

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [CodeEditorPage],
})
export class CodeEditorPageModule {}
