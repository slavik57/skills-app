import {IExistsValidator, ExistsValidatorBase} from "./base/existsValidatorBase";
import {ITeamService, TeamService} from "../services/teamService";
import {Observable} from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import {IValidationResult} from "./iValidationResult";
import {Injectable} from '@angular/core';

export interface ITeamExistsValidator extends IExistsValidator {
}

export class TeamExistsValidator extends ExistsValidatorBase implements ITeamExistsValidator {
  constructor(allowedTeamNames: string[],
    private teamService: ITeamService) {
    super(allowedTeamNames, 'teamNameTaken', 'teamNameTakenCheckFailed')
  }

  protected isValueExists(teamName: string): Observable<boolean> {
    return this.teamService.isTeamExists(teamName);
  }

}

export interface ITeamExistsValidatorFactory {
  create(): ITeamExistsValidator;
  createWithAllowedTeams(teamNames: string[]): ITeamExistsValidator;
}

@Injectable()
export class TeamExistsValidatorFactory implements ITeamExistsValidatorFactory {
  constructor(private teamService: TeamService) {
  }

  public create(): ITeamExistsValidator {
    return new TeamExistsValidator([], this.teamService);
  }

  public createWithAllowedTeams(teamNames: string[]): ITeamExistsValidator {
    return new TeamExistsValidator(teamNames, this.teamService);
  }
}
