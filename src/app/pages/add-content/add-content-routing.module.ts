import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddContentPage } from './add-content.page';

const routes: Routes = [
  {
    path: '',
    component: AddContentPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddContentPageRoutingModule {}
