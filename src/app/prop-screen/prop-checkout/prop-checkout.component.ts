import {Component, Input, Output, EventEmitter} from '@angular/core';
import { PlayerProp } from 'src/app/player-prop';

@Component({
  selector: 'app-prop-checkout',
  templateUrl: './prop-checkout.component.html',
  styleUrls: ['./prop-checkout.component.scss']
})
export class PropCheckoutComponent {
 @Input()
  prop: PlayerProp[] = [{
    name: '',
    id: '',
    description: '',
    price: '',
    point: '',
    event: '',
    isDisabled: false,
    percentTotal: '',
    percentTeam: '',
    avgTotal: '',
    avgTeam: '',
    team1: '',
    team2: '',
    isOpened: false,
    teamAgainst: '',
    averageDifferential: '',
    gamesPlayed: "",
    gamesPlayedvsTeam: "",
    average2022: "",
    average2022vsTeam: ""
  }];
@Input() exit: boolean= true;
@Output() length = new EventEmitter<PlayerProp[]>();
@Output() exitSend = new EventEmitter<boolean>();
  value = 80;
display(){
    console.log(this.prop)
  }

  
  remove(p: any){
    p.isDisabled = false;
    this.prop = this.prop.filter(item => item != p);
    this.length.emit(this.prop)
  }
  exitModal(){
    
    this.exit = false;
    this.exitSend.emit(this.exit);
  }
}
