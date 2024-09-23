import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'convertGameDateToMonthDay'
})
export class ConvertGameDateToMonthDay implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.convertGameDateToMonthDay(value)
    
  }
}