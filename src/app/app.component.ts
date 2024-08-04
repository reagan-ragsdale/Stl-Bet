import { Component, NgZone, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { remult } from 'remult';
import { UsersController } from '../shared/Controllers/UsersController';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  //encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  constructor(zone: NgZone, private router: Router) {
    remult.apiClient.wrapMessageHandling = handler => zone.run(() => handler())
  }
  remult = remult;

   async logout(){
    await UsersController.logout()
    remult.user = undefined;
    this.router.navigate([`/home`])
  }




}
