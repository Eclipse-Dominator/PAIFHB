import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { EditorCodeComponent } from "./editor-code.component";
import { DirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [EditorCodeComponent],
  imports: [CommonModule, FormsModule, IonicModule, DirectivesModule],
  exports: [EditorCodeComponent],
})
export class EditorCodeModule {}
