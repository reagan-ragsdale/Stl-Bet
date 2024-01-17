import { Component, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'home-screen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeScreenComponent {
  constructor(private router: Router){}
  title = 'angulardemo1';
  opened = false;
  clicked = false;
  predictionClicked = false;
  screen: string = '';

  
  propClicked(){
    this.router.navigate(["/props"])
  }

  playerStatsClicked(){
    this.router.navigate(["/playerStats/NBA/279"])
  }



  public buttonClick(event: string){
    this.screen = event;
    //console.log(this.screen);
  }


  async ngOnInit(){
 
}




}
