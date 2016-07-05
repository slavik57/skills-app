import {EmailValidator} from "./emailValidator";
import {
  it,
  describe,
  beforeEach
} from '@angular/core/testing';
import {expect} from 'chai';
import { AbstractControl } from '@angular/common';

describe('EmailValidator', () => {

  var control: AbstractControl

  beforeEach(() => {
    control = <any>{};
  });

  describe('mailFormat', () => {

    it('null mail should return null', () => {
      control.value = null;

      expect(EmailValidator.mailFormat(control)).to.be.null;
    });

    it('undefined mail should return null', () => {
      control.value = undefined;

      expect(EmailValidator.mailFormat(control)).to.be.null;
    });

    it('empty mail should return null', () => {
      control.value = '';

      expect(EmailValidator.mailFormat(control)).to.be.null;
    });

    it('valid mail should return null', () => {
      control.value = 'valid@mail.com';

      expect(EmailValidator.mailFormat(control)).to.be.null;
    });

    it('invalid mail should return error', () => {
      control.value = 'invalidEmail';

      expect(EmailValidator.mailFormat(control)).to.be.deep.equal({ 'format': false });
    });

  });

});
