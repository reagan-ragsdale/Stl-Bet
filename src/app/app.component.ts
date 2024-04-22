import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { remult } from 'remult';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(zone: NgZone) {
    remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler())
  }




}
