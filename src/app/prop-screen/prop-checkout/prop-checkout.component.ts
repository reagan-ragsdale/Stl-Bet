import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import { PlayerProp } from 'src/app/player-prop';

@Component({
  selector: 'app-prop-checkout',
  templateUrl: './prop-checkout.component.html',
  styleUrls: ['./prop-checkout.component.scss']
})
export class PropCheckoutComponent implements OnChanges{
  
 @Input()
  listOfProps: any[] = []
@Input() exit: boolean= true;
@Output() length = new EventEmitter<PlayerProp[]>();
@Output() exitSend = new EventEmitter<boolean>();
  value = 80;
  
  display(){
    console.log(this.listOfProps)
  }

  
  
  remove(p: any){
    p.isDisabled = false;
    this.listOfProps = this.listOfProps.filter(item => item != p);
    this.length.emit(this.listOfProps)
  }
  exitModal(){
    
    this.exit = false;
    this.exitSend.emit(this.exit);
  }

  ngInit(){
    this.display()
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes)
    console.log(this.listOfProps)
  }
}
