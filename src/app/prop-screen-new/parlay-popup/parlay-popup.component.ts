import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-parlay-popup',
  templateUrl: './parlay-popup.component.html',
  styleUrls: ['./parlay-popup.component.scss']
})
export class ParlayPopupComponent {
  @Input()
  listOfProps: any[] = []
  @Input() exit: boolean = true;
  @Output() length = new EventEmitter<any[]>();
  @Output() exitSend = new EventEmitter<boolean>();
  value = 80;

  display() {
  }
  panelOpenState: boolean = false;
  overallProbability: number = 0
  overallChance = 0
  noGamesPlayedTogether = false
  sameGameChance = 0
  isSameGameTeam = false
  noGamesVsTeam = false
  teamSameGameChance = 0

  remove(prop: any){

  }
}
