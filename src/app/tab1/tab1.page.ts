import { Component } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    Title: string = "Productivity At Its Finest";
    GridData = [
        [["r1c1", "globe-outline"]],
        [["r2c1", "globe-outline"], ["r2c2", "globe-outline"]],
        [["r3c1", "globe-outline"], ["r3c2", "globe-outline"], ["r3c3", "globe-outline"]]
    ];
    constructor() {}
}
