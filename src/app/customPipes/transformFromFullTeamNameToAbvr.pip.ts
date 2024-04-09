import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'transforFromFullTeamNameToAbvr'
})
export class TransforFromFullTeamNameToAbvr implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.teamNamesToAbvr[value]
    
  }
}