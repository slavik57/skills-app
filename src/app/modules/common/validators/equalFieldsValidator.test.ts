import {EqualFieldsValidator} from "./equalFieldsValidator";
import {
  it,
  describe,
  beforeEach
} from '@angular/core/testing';
import {expect} from 'chai';
import { FormGroup, FormControl } from '@angular/forms';

describe('EqualFieldsValidator', () => {

  var formGroup: FormGroup;
  var control1: FormControl;
  var control2: FormControl;
  var control3: FormControl;

  beforeEach(() => {
    control1 = new FormControl();
    control2 = new FormControl();
    control3 = new FormControl();

    formGroup = new FormGroup({
      control1: control1,
      control2: control2,
      control3: control3
    });
  });

  describe('allFieldsEqual', () => {

    it('empty form group should return null', () => {
      formGroup = new FormGroup({});

      expect(EqualFieldsValidator.allFieldsEqual(formGroup)).to.be.null;
    });

    it('all values are equal should return null', () => {
      var value = 'some value';

      control1.updateValue(value);
      control1.updateValueAndValidity();
      control2.updateValue(value);
      control2.updateValueAndValidity();
      control3.updateValue(value);
      control3.updateValueAndValidity();

      expect(EqualFieldsValidator.allFieldsEqual(formGroup)).to.be.null;
    });

    it('one value is different should return error', () => {
      var value = 'some value';

      control1.updateValue(value);
      control1.updateValueAndValidity();
      control2.updateValue(value + 1);
      control2.updateValueAndValidity();
      control3.updateValue(value);
      control3.updateValueAndValidity();

      expect(EqualFieldsValidator.allFieldsEqual(formGroup)).to.be.deep.equal({ allFieldsEqual: false });
    });

  });

});
