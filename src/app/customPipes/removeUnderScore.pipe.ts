import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'removeUnderScore'
})
export class RemoveUnderScore implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.removeUnderScore(value)
    
  }
}