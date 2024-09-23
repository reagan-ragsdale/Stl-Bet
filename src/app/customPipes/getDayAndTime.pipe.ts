import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'getDayAndTime'
})
export class GetDayAndTime implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.formatDateString(value)
    
  }
}