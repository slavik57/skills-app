import {ExistsValidatorBase, IExistsValidator} from "./base/existsValidatorBase";
import {IValidationResult} from "./iValidationResult";
import {IUserService, UserService} from "../services/userService";
import { AbstractControl } from '@angular/forms';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';

export interface IUsernameExistsValidator extends IExistsValidator {
}

export class UsernameExistsValidator extends ExistsValidatorBase implements IUsernameExistsValidator {

  constructor(allowedUsernames: string[],
    private userService: IUserService) {
    super(allowedUsernames, 'usernameTaken', 'usernameTakenCheckFailed')
  }

  protected isValueExists(username: string): Observable<boolean> {
    return this.userService.isUsernameExists(username);
  }

}

export interface IUsernameExistsValidatorFactory {
  create(): IUsernameExistsValidator;
  createWithAllowedUsers(usernames: string[]): IUsernameExistsValidator;
}

@Injectable()
export class UsernameExistsValidatorFactory implements IUsernameExistsValidatorFactory {

  constructor(private userService: UserService) {
  }

  public create(): IUsernameExistsValidator {
    return new UsernameExistsValidator([], this.userService);
  }

  public createWithAllowedUsers(usernames: string[]): IUsernameExistsValidator {
    return new UsernameExistsValidator(usernames, this.userService);
  }
}
