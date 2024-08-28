import { Pipe, PipeTransform } from '@angular/core';
import { reusedFunctions } from '../Services/reusedFunctions';
import { TeamInfoController } from 'src/shared/Controllers/TeamInfoController';

@Pipe({
  standalone: true,
  name: 'transforFromFullTeamNameToAbvr'
})
export class TransforFromFullTeamNameToAbvr implements PipeTransform {
  async transform(value: string): Promise<string> {
    let team = await TeamInfoController.getTeamInfoByFullName(value)
    return team[0].teamNameAbvr
    
  }
}