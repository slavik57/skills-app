import {ExistsValidatorBase, IExistsValidator, ExistsValidationMode} from "./base/existsValidatorBase";
import {IValidationResult} from "./iValidationResult";
import {IUserService, UserService} from "../services/userService";
import { AbstractControl } from '@angular/forms';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';

export interface IUsernameNotExistsValidator extends IExistsValidator {
}

export class UsernameNotExistsValidator extends ExistsValidatorBase implements IUsernameNotExistsValidator {

  constructor(private userService: IUserService) {
    super([],
      'usernameDoesNotExist',
      'usernameDoesNotExistCheckFailed',
      ExistsValidationMode.FAIL_IF_NOT_EXISTS)
  }

  protected isValueExists(username: string): Observable<boolean> {
    return this.userService.isUsernameExists(username);
  }

}

export interface IUsernameNotExistsValidatorFactory {
  create(): IUsernameNotExistsValidator;
}

@Injectable()
export class UsernameNotExistsValidatorFactory implements IUsernameNotExistsValidatorFactory {

  constructor(private userService: UserService) {
  }

  public create(): IUsernameNotExistsValidator {
    return new UsernameNotExistsValidator(this.userService);
  }

}
