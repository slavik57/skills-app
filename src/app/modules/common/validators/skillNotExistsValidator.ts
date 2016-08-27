import {ExistsValidatorBase, IExistsValidator, ExistsValidationMode} from "./base/existsValidatorBase";
import {IValidationResult} from "./iValidationResult";
import {ISkillService, SkillService} from "../services/skillService";
import { AbstractControl } from '@angular/forms';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';

export interface ISkillNotExistsValidator extends IExistsValidator {
}

export class SkillNotExistsValidator extends ExistsValidatorBase implements ISkillNotExistsValidator {

  constructor(private skillService: ISkillService) {
    super([],
      'skillDoesNotExist',
      'skillDoesNotExistCheckFailed',
      ExistsValidationMode.FAIL_IF_NOT_EXISTS)
  }

  protected isValueExists(skillName: string): Observable<boolean> {
    return this.skillService.isSkillExists(skillName);
  }

}

export interface ISkillNotExistsValidatorFactory {
  create(): ISkillNotExistsValidator;
}

@Injectable()
export class SkillNotExistsValidatorFactory implements ISkillNotExistsValidatorFactory {

  constructor(private skillService: SkillService) {
  }

  public create(): ISkillNotExistsValidator {
    return new SkillNotExistsValidator(this.skillService);
  }

}
