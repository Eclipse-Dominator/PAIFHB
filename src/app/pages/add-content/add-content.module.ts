import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { AddContentPageRoutingModule } from "./add-content-routing.module";

import { AddContentPage } from "./add-content.page";
import { EditItemListComponent } from "../../components/edit-item-list/edit-item-list.component";
import { EditorCodeModule } from "../../components/editor-code/editor-code.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddContentPageRoutingModule,
    EditorCodeModule,
  ],
  declarations: [AddContentPage, EditItemListComponent],
})
export class AddContentPageModule {}
