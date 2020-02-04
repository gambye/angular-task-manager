import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../../node_modules/font-awesome/css/font-awesome.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor() {}
}
