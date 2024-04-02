import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'transforFromTimestampToMonthDay'
})
export class TransformFromTimestampToMonthDayPipe implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.convertDate(value)
    
  }
}