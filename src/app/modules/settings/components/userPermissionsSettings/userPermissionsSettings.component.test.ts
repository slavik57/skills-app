import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UserPermissionsSettingsComponent} from "./userPermissionsSettings.component";
import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
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
import {IUserService, UserService} from "../../../common/services/userService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

describe('UsersSettingsComponent', () => {

  var userServiceMock: IUserService;
  var getUserPermissionsSpy: SinonSpy;
  var getUserPermissionsResult: Subject<string[]>;
  var userDetails: IUsernameDetails;

  var component: UserPermissionsSettingsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getUserPermissionsSpy =
      stub(userServiceMock, 'getUserPermissions', () => {
        getUserPermissionsResult = new Subject<string[]>();
        return getUserPermissionsResult;
      });

    return [
      provide(UserService, { useValue: userServiceMock }),
      UserPermissionsSettingsComponent
    ];
  });

  beforeEach(inject([UserPermissionsSettingsComponent], (_component: UserPermissionsSettingsComponent) => {
    component = _component;

    userDetails = {
      id: 12321,
      username: 'some username'
    };

    component.userDetails = userDetails;

    component.ngOnInit();
  }));

  it('isLoadingUserPermissions should be true', () => {
    expect(component.isLoadingUserPermissions).to.be.true;
  });

  it('loadingUserPermissionsError should be null', () => {
    expect(component.loadingUserPermissionsError).to.be.null;
  });

  it('should call userService.getUserPermissions()', () => {
    expect(getUserPermissionsSpy.callCount).to.be.equal(1);
    expect(getUserPermissionsSpy.args[0]).to.be.deep.equal([userDetails.id]);
  });

  it('userPermissions should be null', () => {
    expect(component.userPermissions).to.be.null;
  });

  describe('getting user permissions fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      getUserPermissionsResult.error(error);
    });

    it('isLoadingUserPermissions should be false', () => {
      expect(component.isLoadingUserPermissions).to.be.false;
    });

    it('loadingUserPermissionsError should be correct', () => {
      expect(component.loadingUserPermissionsError).to.be.equal(error);
    });

    it('userPermissions should be null', () => {
      expect(component.userPermissions).to.be.null;
    });

    describe('reloadUserPermissions', () => {

      beforeEach(() => {
        getUserPermissionsSpy.reset();

        component.reloadUserPermissions();
      });

      it('isLoadingUserPermissions should be true', () => {
        expect(component.isLoadingUserPermissions).to.be.true;
      });

      it('loadingUserPermissionsError should be null', () => {
        expect(component.loadingUserPermissionsError).to.be.null;
      });

      it('should call userService.getUserPermissions()', () => {
        expect(getUserPermissionsSpy.callCount).to.be.equal(1);
        expect(getUserPermissionsSpy.args[0]).to.be.deep.equal([userDetails.id]);
      });

      it('userPermissions should be null', () => {
        expect(component.userPermissions).to.be.null;
      });

    })

  });

  describe('getting user permissions succeeds', () => {

    var userPermissions: string[];

    beforeEach(() => {
      userPermissions = ['a', 'b', 'c'];

      getUserPermissionsResult.next(userPermissions);
      getUserPermissionsResult.complete();
    });

    it('isLoadingUserPermissions should be false', () => {
      expect(component.isLoadingUserPermissions).to.be.false;
    });

    it('loadingUserPermissionsError should be null', () => {
      expect(component.loadingUserPermissionsError).to.be.null;
    });

    it('userPermissions should be correct', () => {
      expect(component.userPermissions).to.deep.equal(userPermissions);
    });

  });

});
