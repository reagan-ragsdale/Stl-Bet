import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-screen',
  templateUrl: './welcome-screen.component.html',
  styleUrls: ['./welcome-screen.component.sass']
})
export class WelcomeScreenComponent {
  constructor(private router: Router) { 
  }
 

}
