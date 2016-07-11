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
import {spy, SinonSpy} from 'sinon';

describe('UsernameExistsValidatorFactory', () => {

  var userServiceMock: IUserService;
  var usernameExistsValidatorFactory: UsernameExistsValidatorFactory;

  beforeEachProviders(() => {
    userServiceMock = {
      signinUser: () => null,
      registerUser: () => null,
      isUsernameExists: () => null,
      getUserDetails: () => null,
      updateUserDetails: () => null,
      updateUserPassword: () => null
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
      expect(validator['allowedUsernames']).to.be.deep.equal([]);
    });

  });

  describe('createWithAllowedUsers', () => {

    it('should create correct UsernameExistsValidator', () => {
      var usernames = ['a', 'b', 'c'];
      var validator = usernameExistsValidatorFactory.createWithAllowedUsers(usernames);

      expect(validator).to.be.instanceof(UsernameExistsValidator);
      expect(validator['userService']).to.be.equal(userServiceMock);
      expect(validator['allowedUsernames']).to.be.deep.equal(usernames);
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
  var validUsernames: string[];
  var isUsernameExistsSpy: SinonSpy;

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
      getUserDetails: () => null,
      updateUserDetails: () => null,
      updateUserPassword: () => null
    };

    control = new FormControl();

    validUsernames = ['valid username1', 'valid username2'];
    validator = new UsernameExistsValidator(validUsernames, userServiceMock);

    validator.bindControl(control);

    isUsernameExistsSpy = spy(userServiceMock, 'isUsernameExists');
  });

  afterEach(() => {
    Observable.prototype.debounce = originalDebounce;
  });

  describe('usernameExists', () => {

    it('isUsernameExists returns true should return error', () => {
      var actualResult;
      validator.usernameExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.next(true);
      isUsernameExistsResult.complete();

      expect(actualResult).to.deep.equal({ 'usernameTaken': true });
    });

    it('isUsernameExists returns false should be null', () => {
      var actualResult;
      validator.usernameExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.next(false);
      isUsernameExistsResult.complete();

      expect(actualResult).to.be.null;
    });

    it('isUsernameExists rejects should return usernameTakenCheckFailed error', () => {
      var actualResult;
      validator.usernameExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');

      expect(actualResult).to.deep.equal({ 'usernameTakenCheckFailed': true });
    });

    it('value changes without subscriber should not fail', () => {
      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();
    });

    it('null username should be null', () => {
      var actualResult;
      validator.usernameExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = null;
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');

      expect(actualResult).to.be.null;
    });

    it('undefined username should be null', () => {
      var actualResult;
      validator.usernameExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = undefined;
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');

      expect(actualResult).to.be.null;
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

    it('on valid username should not use the user service', () => {
      validator.usernameExists(control);

      control.updateValue(validUsernames[0]);
      control.updateValueAndValidity();

      expect(isUsernameExistsSpy.callCount).to.be.equal(0);
    });

    it('on another valid username should not use the user service', () => {
      validator.usernameExists(control);

      control.updateValue(validUsernames[1]);
      control.updateValueAndValidity();

      expect(isUsernameExistsSpy.callCount).to.be.equal(0);
    });

    it('on valid username should return null', () => {
      control.updateValue(validUsernames[0]);

      var actualResult;
      validator.usernameExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      );

      control.updateValueAndValidity();

      expect(actualResult).to.be.null;
    });

    it('on another valid username should return null', () => {
      control.updateValue(validUsernames[1]);

      var actualResult;
      validator.usernameExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      control.updateValueAndValidity();

      expect(actualResult).to.be.null;
    });

  });

});
