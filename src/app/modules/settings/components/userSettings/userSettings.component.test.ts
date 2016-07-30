import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { UserSettingsComponent } from './userSettings.component';
import {IUserService, UserService} from "../../../common/services/userService";
import { Subject } from 'rxjs/Subject';

describe('UserSettingsComponent', () => {

  var userServiceMock: IUserService;
  var userDetails: IUsernameDetails;
  var canUserUpdatePasswordSpy: SinonSpy;
  var canUserUpdatePasswordResult: Subject<boolean>;

  var component: UserSettingsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    canUserUpdatePasswordSpy =
      stub(userServiceMock, 'canUserUpdatePassword', () => {
        canUserUpdatePasswordResult = new Subject<boolean>();
        return canUserUpdatePasswordResult;
      });

    return [
      provide(UserService, { useValue: userServiceMock }),
      UserSettingsComponent
    ];
  });

  beforeEach(inject([UserSettingsComponent], (_component: UserSettingsComponent) => {
    component = _component;

    userDetails = {
      id: 12321,
      username: 'some username'
    };

    component.userDetails = userDetails;

    component.availableUserSettings = {
      nativeElement: {}
    };

    component.ngOnInit();
  }));

  describe('ngAfterViewInit', () => {

    var jquerySpy: SinonSpy;
    var jqueryResultTabsSpy: SinonSpy;

    beforeEach(() => {
      var jqueryResult = {
        tabs: () => null
      }

      jqueryResultTabsSpy = spy(jqueryResult, 'tabs');

      jquerySpy = stub(window, '$', () => {
        return jqueryResult;
      });

      component.ngAfterViewInit();
    });

    afterEach(() => {
      jquerySpy.restore();
    });

    it('should initialize tabs', () => {
      expect(jquerySpy.callCount).to.be.equal(1);
      expect(jquerySpy.args[0]).to.be.length(1);
      expect(jquerySpy.args[0][0]).to.be.equal(component.availableUserSettings.nativeElement);
      expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
    });

  });

  it('isCheckingCanUserUpdatePassword should be true', () => {
    expect(component.isCheckingCanUserUpdatePassword).to.be.true;
  });

  it('userUpdatePasswordCheckError should be null', () => {
    expect(component.userUpdatePasswordCheckError).to.be.null;
  });

  it('should call userService.canUserUpdatePassword()', () => {
    expect(canUserUpdatePasswordSpy.callCount).to.be.equal(1);
    expect(canUserUpdatePasswordSpy.args[0]).to.be.deep.equal([userDetails.id]);
  });

  it('canUserUpdatePassword should be false', () => {
    expect(component.canUserUpdatePassword).to.be.false;
  });

  describe('checking if user can update password fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      canUserUpdatePasswordResult.error(error);
    });

    it('isCheckingCanUserUpdatePassword should be false', () => {
      expect(component.isCheckingCanUserUpdatePassword).to.be.false;
    });

    it('userUpdatePasswordCheckError should be correct', () => {
      expect(component.userUpdatePasswordCheckError).to.be.equal(error);
    });

    it('canUserUpdatePassword should be false', () => {
      expect(component.canUserUpdatePassword).to.be.false;
    });

    describe('reload', () => {

      beforeEach(() => {
        canUserUpdatePasswordSpy.reset();

        component.reload();
      });

      it('isCheckingCanUserUpdatePassword should be true', () => {
        expect(component.isCheckingCanUserUpdatePassword).to.be.true;
      });

      it('userUpdatePasswordCheckError should be null', () => {
        expect(component.userUpdatePasswordCheckError).to.be.null;
      });

      it('should call userService.canUserUpdatePassword()', () => {
        expect(canUserUpdatePasswordSpy.callCount).to.be.equal(1);
        expect(canUserUpdatePasswordSpy.args[0]).to.be.deep.equal([userDetails.id]);
      });

      it('canUserUpdatePassword should be false', () => {
        expect(component.canUserUpdatePassword).to.be.false;
      });

    })

  });

  describe('getting user permissions succeeds with false', () => {

    beforeEach(() => {
      canUserUpdatePasswordResult.next(false);
      canUserUpdatePasswordResult.complete();
    });

    it('isCheckingCanUserUpdatePassword should be false', () => {
      expect(component.isCheckingCanUserUpdatePassword).to.be.false;
    });

    it('userUpdatePasswordCheckError should be null', () => {
      expect(component.userUpdatePasswordCheckError).to.be.null;
    });

    it('canUserUpdatePassword should be false', () => {
      expect(component.canUserUpdatePassword).to.be.false;
    });

  });

  describe('getting user permissions succeeds with true', () => {

    beforeEach(() => {
      canUserUpdatePasswordResult.next(true);
      canUserUpdatePasswordResult.complete();
    });

    it('isCheckingCanUserUpdatePassword should be false', () => {
      expect(component.isCheckingCanUserUpdatePassword).to.be.false;
    });

    it('userUpdatePasswordCheckError should be null', () => {
      expect(component.userUpdatePasswordCheckError).to.be.null;
    });

    it('canUserUpdatePassword should be true', () => {
      expect(component.canUserUpdatePassword).to.be.true;
    });

  });

});
