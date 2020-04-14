import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CodeTextAreaDirective } from "./code-text-area.directive";

@NgModule({
  declarations: [CodeTextAreaDirective],
  imports: [CommonModule],
  exports: [CodeTextAreaDirective],
})
export class DirectivesModule {}
