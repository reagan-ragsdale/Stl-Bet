import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'convertCommenceTimePipe'
})
export class ConvertCommenceTimePipe implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.convertCommenceTime(value)
    
  }
}