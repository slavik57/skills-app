import {LocationService, ILocationService} from "../../../common/services/locationService";
import {SigninComponent} from "./signin.component";
import {IUserService, UserService} from "../../../common/services/userService";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {SinonSpy, spy} from 'sinon';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

describe('SigninComponent', () => {

  var userServiceMock: IUserService;
  var locationServiceMock: ILocationService;

  var signinComponent: SigninComponent;
  var signinUserResult: Subject<string>;

  beforeEachProviders(() => {

    signinUserResult = new Subject<string>()

    userServiceMock = {
      signinUser: () => signinUserResult,
      isUsernameExists: () => null,
      registerUser: () => null,
      getUserDetails: () => null,
      updateUserDetails: () => null
    };

    locationServiceMock = {
      goToUrl: () => { }
    }

    return [
      provide(UserService, { useValue: userServiceMock }),
      provide(LocationService, { useValue: locationServiceMock }),
      SigninComponent
    ];
  });

  beforeEach(inject([SigninComponent], (_signinComponent: SigninComponent) => {
    signinComponent = _signinComponent;
  }));

  it('should be initialized correctly', () => {
    expect(signinComponent.error).to.be.null;
    expect(signinComponent.model.username).to.be.undefined;
    expect(signinComponent.model.password).to.be.undefined;
    expect(signinComponent.submitting).to.be.false;
  });

  describe('onSubmit', () => {
    var username: string;
    var password: string;
    var signinUserSpy: SinonSpy;

    beforeEach(() => {
      username = 'some username';
      password = 'some passwoed';

      signinComponent.model.username = username;
      signinComponent.model.password = password;

      signinUserSpy = spy(userServiceMock, 'signinUser');

      signinComponent.onSubmit();
    });

    it('should set submitting to true', () => {
      expect(signinComponent.submitting).to.be.true;
    });

    it('should call the service correctly', () => {
      expect(signinUserSpy.callCount).to.be.equal(1)
      expect(signinUserSpy.args[0][0]).to.be.equal(username);
      expect(signinUserSpy.args[0][1]).to.be.equal(password);
    });

    describe('user service fails', () => {

      var error: any;

      beforeEach(() => {
        error = 'some error';

        signinUserResult.error(error);
      });

      it('should set submitting to false', () => {
        expect(signinComponent.submitting).to.be.false;
      });

      it('should set the error correctly', () => {
        expect(signinComponent.error).to.be.equal(error);
      });

    });

    describe('user service succeeds', () => {

      var redirectUrl: any;
      var goToUrlSpy: SinonSpy;

      beforeEach(() => {
        redirectUrl = 'some url';

        goToUrlSpy = spy(locationServiceMock, 'goToUrl');

        signinUserResult.next(redirectUrl);
        signinUserResult.complete();
      });

      it('should set submitting to true', () => {
        expect(signinComponent.submitting).to.be.true;
      });

      it('should navigate to correct url', () => {
        expect(goToUrlSpy.args[0][0]).to.be.equal(redirectUrl);
      });

    });

  });

});
