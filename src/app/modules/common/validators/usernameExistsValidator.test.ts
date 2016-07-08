import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {IUserService, UserService} from "../services/userService";
import {UsernameExistsValidator, UsernameExistsValidatorFactory} from "./usernameExistsValidator";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {FormControl} from '@angular/forms';

describe('UsernameExistsValidatorFactory', () => {

  var userServiceMock: IUserService;
  var usernameExistsValidatorFactory: UsernameExistsValidatorFactory;

  beforeEachProviders(() => {
    userServiceMock = {
      signinUser: () => null,
      registerUser: () => null,
      isUsernameExists: () => null,
      getUserDetails: () => null
    };

    return [
      provide(UserService, { useValue: userServiceMock }),
      UsernameExistsValidatorFactory
    ];
  });

  beforeEach(inject([UsernameExistsValidatorFactory], (_usernameExistsValidatorFactory: UsernameExistsValidatorFactory) => {
    usernameExistsValidatorFactory = _usernameExistsValidatorFactory;
  }));

  describe('create', () => {

    it('should create correct UsernameExistsValidator', () => {
      var validator = usernameExistsValidatorFactory.create();

      expect(validator).to.be.instanceof(UsernameExistsValidator);
      expect(validator['userService']).to.be.equal(userServiceMock);
    });

  });

});

describe('UsernameExistsValidator', () => {

  var username: string;
  var isUsernameExistsResult: Subject<boolean>;
  var userServiceMock: IUserService;
  var control: FormControl;
  var validator: UsernameExistsValidator;
  var originalDebounce: any;

  beforeEach(() => {
    originalDebounce = Observable.prototype.debounce;
    Observable.prototype.debounceTime = function() {
      return this;
    }

    isUsernameExistsResult = new Subject<boolean>();

    userServiceMock = {
      signinUser: () => null,
      registerUser: () => null,
      isUsernameExists: () => isUsernameExistsResult,
      getUserDetails: () => null
    };

    control = new FormControl();

    validator = new UsernameExistsValidator(userServiceMock);

    validator.bindControl(control);
  });

  afterEach(() => {
    Observable.prototype.debounce = originalDebounce;
  });

  describe('usernameExists', () => {

    it('isUsernameExists returns true should return error', () => {
      validator.usernameExists(control).subscribe(
        (_result) => {
          expect(_result).to.deep.equal({ 'usernameTaken': true });
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.next(true);
      isUsernameExistsResult.complete();
    });


    it('isUsernameExists returns false should be null', () => {
      validator.usernameExists(control).subscribe(
        (_result) => {
          expect(_result).to.be.null;
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.next(false);
      isUsernameExistsResult.complete();
    });

    it('isUsernameExists rejects should return usernameTakenCheckFailed error', () => {
      validator.usernameExists(control).subscribe(
        (_result) => {
          expect(_result).to.deep.equal({ 'usernameTakenCheckFailed': true });
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');
    });

    it('value changes without subscriber should not fail', () => {
      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();
    });

    it('null username should be null', () => {
      validator.usernameExists(control).subscribe(
        (_result) => {
          expect(_result).to.be.null;
        }
      )

      username = null;
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');
    });

    it('undefined username should be null', () => {
      validator.usernameExists(control).subscribe(
        (_result) => {
          expect(_result).to.be.null;
        }
      )

      username = undefined;
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');
    });

    it('empty username should be null', () => {
      validator.usernameExists(control).subscribe(
        (_result) => {
          expect(_result).to.be.null;
        }
      )

      username = '';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');
    });

  });

});
