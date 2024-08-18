import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'transformFromTimestampToTime'
})
export class TransformFromTimestampToTimePipe implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.convertTimestampToTime(value)
    
  }
}