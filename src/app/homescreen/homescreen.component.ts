import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'home-screen',
  templateUrl: './homescreen.component.html',
  styleUrls: ['./homescreen.component.scss']
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



  public buttonClick(event: string){
    this.screen = event;
    //console.log(this.screen);
  }


  async ngOnInit(){
 
}




}
