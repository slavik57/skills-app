import {UserServiceMockFactory} from "../../../testUtils/mockFactories/userServiceMockFactory";
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
import {UsernameNotExistsValidator, UsernameNotExistsValidatorFactory} from "./usernameNotExistsValidator";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {spy, SinonSpy} from 'sinon';

describe('UsernameNotExistsValidatorFactory', () => {

  var userServiceMock: IUserService;
  var usernameNotExistsValidatorFactory: UsernameNotExistsValidatorFactory;

  beforeEachProviders(() => {
    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    return [
      provide(UserService, { useValue: userServiceMock }),
      UsernameNotExistsValidatorFactory
    ];
  });

  beforeEach(inject([UsernameNotExistsValidatorFactory], (_factory: UsernameNotExistsValidatorFactory) => {
    usernameNotExistsValidatorFactory = _factory;
  }));

  describe('create', () => {

    it('should create correct UsernameNotExistsValidator', () => {
      var validator = usernameNotExistsValidatorFactory.create();

      expect(validator).to.be.instanceof(UsernameNotExistsValidator);
      expect(validator['userService']).to.be.equal(userServiceMock);
      expect(validator['allowedValues']).to.be.deep.equal([]);
    });

  });

});

describe('UsernameNotExistsValidator', () => {

  var username: string;
  var isUsernameExistsResult: Subject<boolean>;
  var userServiceMock: IUserService;
  var control: FormControl;
  var validator: UsernameNotExistsValidator;
  var originalDebounce: any;
  var isUsernameExistsSpy: SinonSpy;

  beforeEach(() => {
    originalDebounce = Observable.prototype.debounce;
    Observable.prototype.debounceTime = function() {
      return this;
    }

    isUsernameExistsResult = new Subject<boolean>();

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    userServiceMock.isUsernameExists = () => isUsernameExistsResult;

    control = new FormControl();

    validator = new UsernameNotExistsValidator(userServiceMock);

    validator.bindControl(control);

    isUsernameExistsSpy = spy(userServiceMock, 'isUsernameExists');
  });

  afterEach(() => {
    Observable.prototype.debounce = originalDebounce;
  });

  describe('usernameExists', () => {

    it('isUsernameExists returns false should return error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.next(false);
      isUsernameExistsResult.complete();

      expect(actualResult).to.deep.equal({ 'usernameDoesNotExist': true });
    });

    it('isUsernameExists returns true should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.next(true);
      isUsernameExistsResult.complete();

      expect(actualResult).to.be.null;
    });

    it('isUsernameExists rejects should return usernameDoesNotExistCheckFailed error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();

      isUsernameExistsResult.error('some error');

      expect(actualResult).to.deep.equal({ 'usernameDoesNotExistCheckFailed': true });
    });

    it('value changes without subscriber should not fail', () => {
      username = 'some username';
      control.updateValue(username);
      control.updateValueAndValidity();
    });

    it('null username should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
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
      validator.isExists(control).subscribe(
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
      validator.isExists(control).subscribe(
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

  describe('destroy', () => {

    beforeEach(() => {
      validator.destroy();
    });

    it('calling destroy before binding to control should not fail', () => {
      new UsernameNotExistsValidator(userServiceMock).destroy();
    });

    describe('usernameExists', () => {

      it('on subscribtion should not return anything', () => {
        var numberOfTimesCalled = 0;
        validator.isExists(control).subscribe(
          (_result) => {
            numberOfTimesCalled++;
          }
        )

        username = 'some username';
        control.updateValue(username);
        control.updateValueAndValidity();

        expect(numberOfTimesCalled).to.equal(0);
      });

      it('value changes should not fail', () => {
        username = 'some username';
        control.updateValue(username);
        control.updateValueAndValidity();
      });

      it('on valid username should not use the user service', () => {
        validator.isExists(control).subscribe(
          (_result) => {
          }
        );

        username = 'some username';
        control.updateValue(username);
        control.updateValueAndValidity();

        expect(isUsernameExistsSpy.callCount).to.be.equal(0);
      });

    });

  });

});
