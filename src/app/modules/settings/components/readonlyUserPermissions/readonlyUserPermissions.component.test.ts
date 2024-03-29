import {IUserPermission} from "../../../common/interfaces/iUserPermission";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {ReadonlyUserPermissionsComponent} from "./readonlyUserPermissions.component";
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

describe('ReadonlyUserPermissionsComponent', () => {

  var userServiceMock: IUserService;
  var getUserPermissionsSpy: SinonSpy;
  var getUserPermissionsResult: Subject<IUserPermission[]>;
  var userDetails: IUsernameDetails;
  var userPermissionsChangedRaises: IUserPermission[][];

  var component: ReadonlyUserPermissionsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getUserPermissionsSpy =
      stub(userServiceMock, 'getUserPermissions', () => {
        getUserPermissionsResult = new Subject<IUserPermission[]>();
        return getUserPermissionsResult;
      });

    return [
      provide(UserService, { useValue: userServiceMock }),
      ReadonlyUserPermissionsComponent
    ];
  });

  beforeEach(inject([ReadonlyUserPermissionsComponent], (_component: ReadonlyUserPermissionsComponent) => {
    component = _component;

    userDetails = {
      id: 12321,
      username: 'some username'
    };

    component.userDetails = userDetails;
    userPermissionsChangedRaises = [];
    component.userPermissionsChanged.subscribe((_userPermissions: IUserPermission[]) => {
      userPermissionsChangedRaises.push(_userPermissions);
    });

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

  it('userPermissionsChanged should exist', () => {
    expect(component.userPermissionsChanged).to.exist;
  });

  it('userPermissionsChanged should not be raised', () => {
    expect(userPermissionsChangedRaises).to.deep.equal([]);
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

    it('userPermissionsChanged should not be raised', () => {
      expect(userPermissionsChangedRaises).to.deep.equal([]);
    });

    describe('reload', () => {

      beforeEach(() => {
        getUserPermissionsSpy.reset();

        component.reload();
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

      it('userPermissionsChanged should not be raised', () => {
        expect(userPermissionsChangedRaises).to.deep.equal([]);
      });

    })

  });

  describe('getting user permissions succeeds', () => {

    var userPermissions: IUserPermission[];

    beforeEach(() => {
      userPermissions = [
        { value: 0, name: 'a', description: 'a description' },
        { value: 1, name: 'b', description: 'b description' },
        { value: 2, name: 'c', description: 'c description' },
      ];

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

    it('userPermissionsChanged should be raised correctly', () => {
      expect(userPermissionsChangedRaises).to.deep.equal([userPermissions]);
    });

  });

});
