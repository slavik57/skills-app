import {IValidationResult} from "../iValidationResult";
import { AbstractControl } from '@angular/forms';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subscriber} from 'rxjs/Subscriber';
import {Subscription} from 'rxjs/Subscription';

export interface IExistsValidator {
  bindControl(control: AbstractControl): void;
  isExists(control: AbstractControl): Observable<IValidationResult>;
  destroy(): void;
}

export abstract class ExistsValidatorBase implements IExistsValidator {

  private _subscriber: Subscriber<IValidationResult>;
  private _valueChangesSubscription: Subscription;

  constructor(private allowedValues: string[],
    private errorOnExists: string,
    private errorOnFailChecking: string) {
  }

  public bindControl(control: AbstractControl): void {
    this._valueChangesSubscription =
      control.valueChanges
        .debounceTime(500)
        .subscribe((newValue: string) => {
          if (!this._subscriber) {
            return;
          }
          if (!newValue) {
            this._resolveSubscriber(this._subscriber, null);
            return;
          }

          this.isValueExists(newValue)
            .subscribe((isExistsResult: boolean) => this._handleResult(isExistsResult, this._subscriber),
            (error: any) => this._handleError(error, this._subscriber))
        });
  }

  public isExists(control: AbstractControl): Observable<IValidationResult> {
    return new Observable<IValidationResult>((subscriber: Subscriber<IValidationResult>) => {

      if (this.allowedValues.indexOf(control.value) >= 0) {
        this._subscriber = null;
        this._resolveSubscriber(subscriber, null);
        return;
      }

      this._subscriber = subscriber;
    });
  }

  public destroy(): void {
    this._subscriber = null;

    if (this._valueChangesSubscription) {
      this._valueChangesSubscription.unsubscribe();
    }

    this._valueChangesSubscription = null;
  }

  protected abstract isValueExists(value: string): Observable<boolean>;

  private _handleResult(isExistsResult: boolean, subscriber: Subscriber<IValidationResult>): void {
    if (!isExistsResult) {
      this._resolveSubscriber(subscriber, null);
    } else {
      var validationErrorResult: IValidationResult = {};
      validationErrorResult[this.errorOnExists] = true;

      this._resolveSubscriber(subscriber, validationErrorResult);
    }
  }

  private _handleError(error: any, subscriber: Subscriber<IValidationResult>): void {
    var validationFailedErrorResult: IValidationResult = {};
    validationFailedErrorResult[this.errorOnFailChecking] = true;

    this._resolveSubscriber(subscriber, validationFailedErrorResult);
  }

  private _resolveSubscriber(subscriber: Subscriber<IValidationResult>, value: IValidationResult): void {
    subscriber.next(value);
    subscriber.complete();
  }
}
