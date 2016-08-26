import {IExistsValidator, ExistsValidatorBase} from "./base/existsValidatorBase";
import {ISkillService, SkillService} from "../services/skillService";
import {Observable} from 'rxjs/Observable';
import { AbstractControl } from '@angular/forms';
import {IValidationResult} from "./iValidationResult";
import {Injectable} from '@angular/core';

export interface ISkillExistsValidator extends IExistsValidator {
}

export class SkillExistsValidator extends ExistsValidatorBase implements ISkillExistsValidator {
  constructor(allowedSkillNames: string[],
    private skillService: ISkillService) {
    super(allowedSkillNames, 'skillNameTaken', 'skillNameTakenCheckFailed')
  }

  protected isValueExists(skillName: string): Observable<boolean> {
    return this.skillService.isSkillExists(skillName);
  }

}

export interface ISkillExistsValidatorFactory {
  create(): ISkillExistsValidator;
  createWithAllowedSkills(skillNames: string[]): ISkillExistsValidator;
}

@Injectable()
export class SkillExistsValidatorFactory implements ISkillExistsValidatorFactory {
  constructor(private skillService: SkillService) {
  }

  public create(): ISkillExistsValidator {
    return new SkillExistsValidator([], this.skillService);
  }

  public createWithAllowedSkills(skillNames: string[]): ISkillExistsValidator {
    return new SkillExistsValidator(skillNames, this.skillService);
  }
}
