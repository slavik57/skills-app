import {IValidationResult} from "./iValidationResult";
import { AbstractControl } from '@angular/common';
import * as validator from 'validator';

export class EmailValidator {
  public static mailFormat(control: AbstractControl): IValidationResult {
    var value = control.value;

    if (!value) {
      return null;
    }

    if (validator.isEmail(value)) {
      return null;
    }

    return { 'format': false }
  }
}
