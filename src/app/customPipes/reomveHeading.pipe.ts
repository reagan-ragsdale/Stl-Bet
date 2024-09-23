import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';

@Pipe({
  standalone: true,
  name: 'removeHeading'
})
export class RemoveHeading implements PipeTransform {
  transform(value: string): string {
    return reusedFunctions.removeHeading(value)
    
  }
}