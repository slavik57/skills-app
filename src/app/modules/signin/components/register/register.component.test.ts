import {IValidationResult} from "../../../common/validators/iValidationResult";
import {RegisterComponent} from "./register.component";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {IUserService, UserService} from "../../../common/services/userService";
import {LocationService, ILocationService} from "../../../common/services/locationService";
import {
  IUsernameExistsValidator,
  UsernameExistsValidator,
  IUsernameExistsValidatorFactory,
  UsernameExistsValidatorFactory
} from "../../../common/validators/usernameExistsValidator";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {SinonSpy, spy} from 'sinon';

describe('RegisterComponent', () => {

  var userServiceMock: IUserService;
  var registerUserResult: Subject<string>;

  var locationServiceMock: ILocationService;

  var usernameExistsResult: Subject<IValidationResult>;
  var usernameExistsValidatorMock: IUsernameExistsValidator;
  var usernameExistsValidatorFactoryMock: IUsernameExistsValidatorFactory;
  var usernameExistsValidatorBindControlSpy: SinonSpy;

  var registerComponent: RegisterComponent;

  beforeEachProviders(() => {

    registerUserResult = new Subject<string>()

    userServiceMock = {
      signinUser: () => null,
      registerUser: () => registerUserResult,
      isUsernameExists: () => null,
      getUserDetails: () => null
    };

    locationServiceMock = {
      goToUrl: () => { }
    }

    usernameExistsResult = new Subject<IValidationResult>();
    usernameExistsValidatorMock = {
      bindControl: () => { },
      usernameExists: () => usernameExistsResult
    }

    usernameExistsValidatorBindControlSpy =
      spy(usernameExistsValidatorMock, 'bindControl');

    usernameExistsValidatorFactoryMock = {
      create: () => usernameExistsValidatorMock
    }

    return [
      FormBuilder,
      provide(UserService, { useValue: userServiceMock }),
      provide(LocationService, { useValue: locationServiceMock }),
      provide(UsernameExistsValidatorFactory, { useValue: usernameExistsValidatorFactoryMock }),
      RegisterComponent
    ];
  });

  beforeEach(inject([RegisterComponent], (_registerComponent: RegisterComponent) => {
    registerComponent = _registerComponent;
    registerComponent.ngOnInit();
  }));

  it('should be initialized correctly', () => {
    expect(registerComponent.error).to.be.undefined;
    expect(registerComponent.model.username).to.be.undefined;
    expect(registerComponent.model.password).to.be.undefined;
    expect(registerComponent.model.repeatPassword).to.be.undefined;
    expect(registerComponent.model.email).to.be.undefined;
    expect(registerComponent.model.firstName).to.be.undefined;
    expect(registerComponent.model.lastName).to.be.undefined;
    expect(registerComponent.submitting).to.be.false;
    expect(registerComponent.registerFormGroup).to.not.equal(null);
    expect(registerComponent.passwordsGroup).to.not.equal(null);
  });

  it('should bind the username control to the usernameExistsValidator', () => {
    expect(usernameExistsValidatorBindControlSpy.callCount).to.be.equal(1);
    expect(usernameExistsValidatorBindControlSpy.args[0][0]).to.be.equal(registerComponent.registerFormGroup.controls['username']);
  });

  describe('form validations', () => {

    var validEmail: string;
    var invalidEmail: string;
    var validFirstName: string;
    var invalidFirstName: string;
    var validLastName: string;
    var invalidLastName: string;

    var emailControl: FormControl;
    var firstNameControl: FormControl;
    var lastNameControl: FormControl;

    beforeEach(() => {
      validEmail = 'somevalid@Mail.com';
      invalidEmail = 'someInvalidMail';
      validFirstName = 'some name';
      invalidFirstName = '';
      validLastName = 'some last name';
      invalidLastName = '';

      emailControl =
        <FormControl>registerComponent.registerFormGroup.controls['email'];
      firstNameControl =
        <FormControl>registerComponent.registerFormGroup.controls['firstName'];
      lastNameControl =
        <FormControl>registerComponent.registerFormGroup.controls['lastName'];
    });

    describe('username', () => {

      var validUsername: string;
      var invalidUsername: string;

      var usernameControl: FormControl;

      beforeEach(() => {
        validUsername = 'validUsername';
        invalidUsername = '';

        usernameControl =
          <FormControl>registerComponent.registerFormGroup.controls['username'];
      });

      describe('username does not exist', () => {

        it('valid username should succeed validation', () => {
          usernameControl.updateValue(validUsername);
          usernameControl.updateValueAndValidity();

          usernameExistsResult.next(null);
          usernameExistsResult.complete();

          expect(usernameControl.errors).to.be.null;
        });

        it('invalid username should fail validation', () => {
          usernameControl.updateValue(invalidUsername);
          usernameControl.updateValueAndValidity();

          usernameExistsResult.next(null);
          usernameExistsResult.complete();

          expect(usernameControl.errors).not.to.be.null;
        });

      });

      describe('username exists', () => {

        it('valid username should fail validation', () => {
          usernameControl.updateValue(validUsername);
          usernameControl.updateValueAndValidity();

          usernameExistsResult.next({ 'someError': true });
          usernameExistsResult.complete();

          expect(usernameControl.errors).not.to.be.null;
        });

        it('invalid username should fail validation', () => {
          usernameControl.updateValue(invalidUsername);
          usernameControl.updateValueAndValidity();

          usernameExistsResult.next({ 'someError': true });
          usernameExistsResult.complete();

          expect(usernameControl.errors).not.to.be.null;
        });

      });

    });

    describe('passwords', () => {

      var invalidPassword: string;
      var validPassword: string;
      var invalidRepeatPassword: string;
      var validRepeatPassword: string;
      var validButNotSamePassword: string;

      var passwordControl: FormControl;
      var repeatPasswordControl: FormControl;
      var passwordsGroup: FormGroup;

      beforeEach(() => {
        validPassword = 'some password';
        invalidPassword = '';
        validRepeatPassword = validPassword;
        invalidRepeatPassword = '';
        validButNotSamePassword = 'some other password';

        passwordsGroup = registerComponent.passwordsGroup;
        passwordControl =
          <FormControl>passwordsGroup.controls['password'];
        repeatPasswordControl =
          <FormControl>passwordsGroup.controls['repeatPassword']
      });

      it('valid password should succeed validation', () => {
        passwordControl.updateValue(validPassword);
        passwordControl.updateValueAndValidity();

        expect(passwordControl.errors).to.be.null;
      });

      it('invalid password should fail validation', () => {
        passwordControl.updateValue(invalidPassword);
        passwordControl.updateValueAndValidity();

        expect(passwordControl.errors).not.to.be.null;
      });

      it('valid repeat password should succeed validation', () => {
        repeatPasswordControl.updateValue(validRepeatPassword);
        repeatPasswordControl.updateValueAndValidity();

        expect(repeatPasswordControl.errors).to.be.null;
      });

      it('invalid repeat password should fail validation', () => {
        repeatPasswordControl.updateValue(invalidRepeatPassword);
        repeatPasswordControl.updateValueAndValidity();

        expect(repeatPasswordControl.errors).not.to.be.null;
      });

      it('same empty password and repeat password, passwordsGroup should be valid', () => {
        passwordControl.updateValue('');
        passwordControl.updateValueAndValidity();

        repeatPasswordControl.updateValue('');
        repeatPasswordControl.updateValueAndValidity();

        expect(passwordsGroup.errors).to.be.null;
      });

      it('same valid password and repeat password, passwordsGroup should be valid', () => {
        passwordControl.updateValue(validPassword);
        passwordControl.updateValueAndValidity();

        repeatPasswordControl.updateValue(validRepeatPassword);
        repeatPasswordControl.updateValueAndValidity();

        expect(passwordsGroup.errors).to.be.null;
      });

      it('different valid password and repeat password, passwordsGroup should be invalid', () => {
        passwordControl.updateValue(validPassword);
        passwordControl.updateValueAndValidity();

        repeatPasswordControl.updateValue(validButNotSamePassword);
        repeatPasswordControl.updateValueAndValidity();

        expect(passwordsGroup.errors).to.not.be.null;
      });

    });

    it('valid mail should succeed validation', () => {
      emailControl.updateValue(validEmail);
      emailControl.updateValueAndValidity();

      expect(emailControl.errors).to.be.null;
    });

    it('invalid mail should fail validation', () => {
      emailControl.updateValue(invalidEmail);
      emailControl.updateValueAndValidity();

      expect(emailControl.errors).not.to.be.null;
    });

    it('valid firstName should succeed validation', () => {
      firstNameControl.updateValue(validFirstName);
      firstNameControl.updateValueAndValidity();

      expect(firstNameControl.errors).to.be.null;
    });

    it('invalid firstName should fail validation', () => {
      firstNameControl.updateValue(invalidFirstName);
      firstNameControl.updateValueAndValidity();

      expect(firstNameControl.errors).not.to.be.null;
    });

    it('valid lastName should succeed validation', () => {
      lastNameControl.updateValue(validLastName);
      lastNameControl.updateValueAndValidity();

      expect(lastNameControl.errors).to.be.null;
    });

    it('invalid lastName should fail validation', () => {
      lastNameControl.updateValue(invalidLastName);
      lastNameControl.updateValueAndValidity();

      expect(lastNameControl.errors).not.to.be.null;
    });

  });

  describe('onSubmit', () => {

    var username: string;
    var password: string;
    var repeatPassword: string;
    var email: string;
    var firstName: string;
    var lastName: string;

    var registerUserSpy: SinonSpy;

    beforeEach(() => {
      username = 'some username';
      password = 'some password';
      repeatPassword = 'some password';
      email = 'some email';
      firstName = 'some firstName';
      lastName = 'some lastName';

      registerComponent.model.username = username;
      registerComponent.model.password = password;
      registerComponent.model.repeatPassword = repeatPassword;
      registerComponent.model.email = email;
      registerComponent.model.firstName = firstName;
      registerComponent.model.lastName = lastName;

      registerUserSpy = spy(userServiceMock, 'registerUser');

      registerComponent.onSubmit();
    });

    it('should set submitting to true', () => {
      expect(registerComponent.submitting).to.be.true;
    });

    it('should call the service correctly', () => {
      expect(registerUserSpy.callCount).to.be.equal(1)
      expect(registerUserSpy.args[0][0]).to.be.equal(username);
      expect(registerUserSpy.args[0][1]).to.be.equal(password);
      expect(registerUserSpy.args[0][2]).to.be.equal(email);
      expect(registerUserSpy.args[0][3]).to.be.equal(firstName);
      expect(registerUserSpy.args[0][4]).to.be.equal(lastName);
    });

    describe('user service fails', () => {

      var error: any;

      beforeEach(() => {
        error = 'some error';

        registerUserResult.error(error);
      });

      it('should set submitting to false', () => {
        expect(registerComponent.submitting).to.be.false;
      });

      it('should set the error correctly', () => {
        expect(registerComponent.error).to.be.equal(error);
      });

    });

    describe('user service succeeds', () => {

      var redirectUrl: any;
      var goToUrlSpy: SinonSpy;

      beforeEach(() => {
        redirectUrl = 'some url';

        goToUrlSpy = spy(locationServiceMock, 'goToUrl');

        registerUserResult.next(redirectUrl);
        registerUserResult.complete();
      });

      it('should set submitting to true', () => {
        expect(registerComponent.submitting).to.be.true;
      });

      it('should navigate to correct url', () => {
        expect(goToUrlSpy.args[0][0]).to.be.equal(redirectUrl);
      });

    });

  });

});
