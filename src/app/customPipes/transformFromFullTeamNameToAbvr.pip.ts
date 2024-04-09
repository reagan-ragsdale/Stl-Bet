import { Pipe, PipeTransform } from '@angular/core';
import { MlbService } from '../Services/MlbService';

@Pipe({
  standalone: true,
  name: 'transforFromFullTeamNameToAbvr'
})
export class TransforFromFullTeamNameToAbvr implements PipeTransform {
  transform(value: string): string {
    return MlbService.mlbTeamNameToAbvr[value]
    
  }
}