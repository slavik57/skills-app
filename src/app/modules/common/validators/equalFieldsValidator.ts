import {IValidationResult} from "./iValidationResult";
import { FormGroup, AbstractControl } from '@angular/forms';
import * as _ from 'lodash';

export class EqualFieldsValidator {
  public static allFieldsEqual(group: FormGroup): IValidationResult {
    var values = [];
    for (var controlName in group.controls) {
      var control: AbstractControl = group.controls[controlName];
      var value = control.value;

      values.push(value);
    }

    var valid: boolean = EqualFieldsValidator._areAllValuseEqual(values);
    if (valid) {
      return null;
    }

    return {
      'allFieldsEqual': false
    }
  }

  private static _areAllValuseEqual(values: any[]): boolean {
    if (values.length < 1) {
      return true;
    }

    var firstValue = values[0];

    return _.every(values, (_value) => _value === firstValue);
  }
}
