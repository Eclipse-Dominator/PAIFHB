import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EditorCodeComponent } from "./editor-code.component";

@NgModule({
  declarations: [EditorCodeComponent],
  imports: [CommonModule, FormsModule, IonicModule],
  exports: [EditorCodeComponent],
})
export class EditorCodeModule {}
