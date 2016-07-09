import {IValidationResult} from "./iValidationResult";
import {IUserService, UserService} from "../services/userService";
import { AbstractControl } from '@angular/forms';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';

export interface IUsernameExistsValidator {
  bindControl(control: AbstractControl): void;
  usernameExists(control: AbstractControl): Observable<IValidationResult>;
}

export class UsernameExistsValidator implements IUsernameExistsValidator {

  private _subscriber: Subscriber<IValidationResult>

  constructor(private allowedUsernames: string[],
    private userService: IUserService) {
  }

  public bindControl(control: AbstractControl): void {
    control.valueChanges
      .debounceTime(2000)
      .subscribe((username: string) => {
        if (!this._subscriber) {
          return;
        }
        if (!username) {
          this._resolveSubscriber(this._subscriber, null);
          return;
        }

        this.userService.isUsernameExists(username)
          .subscribe((isUsernameExist: boolean) => this._handleResult(isUsernameExist, this._subscriber),
          (error: any) => this._handleError(error, this._subscriber))
      });
  }

  public usernameExists(control: AbstractControl): Observable<IValidationResult> {
    return new Observable<IValidationResult>((subscriber: Subscriber<IValidationResult>) => {

      if (this.allowedUsernames.indexOf(control.value) >= 0) {
        this._subscriber = null;
        this._resolveSubscriber(subscriber, null);
        return;
      }

      this._subscriber = subscriber;
    });
  }

  private _handleResult(isUsernameExist: boolean, subscriber: Subscriber<IValidationResult>): void {
    if (!isUsernameExist) {
      this._resolveSubscriber(subscriber, null);
    } else {
      var validationErrorResult: IValidationResult = { 'usernameTaken': true };

      this._resolveSubscriber(subscriber, validationErrorResult);
    }
  }

  private _handleError(error: any, subscriber: Subscriber<IValidationResult>): void {
    var validationFailedErrorResult: { [key: string]: boolean } = { 'usernameTakenCheckFailed': true };

    this._resolveSubscriber(subscriber, validationFailedErrorResult);
  }

  private _resolveSubscriber(subscriber: Subscriber<IValidationResult>, value: IValidationResult): void {
    subscriber.next(value);
    subscriber.complete();
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
