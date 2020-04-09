import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeTabContainerPageRoutingModule } from './home-tab-container-routing.module';

import { HomeTabContainerPage } from './home-tab-container.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeTabContainerPageRoutingModule
  ],
  declarations: [HomeTabContainerPage]
})
export class HomeTabContainerPageModule {}
