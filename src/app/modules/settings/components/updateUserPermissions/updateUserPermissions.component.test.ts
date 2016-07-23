import {IUserPermissionRule} from "../../../common/interfaces/iUserPermissionRule";
import {IUserPermission} from "../../../common/interfaces/iUserPermission";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UpdateUserPermissionsComponent} from "./updateUserPermissions.component";
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
  var getUserPermissionsRulesSpy: SinonSpy;
  var getUserPermissionsRulesResult: Subject<IUserPermissionRule[]>;
  var userDetails: IUsernameDetails;
  var userPermissions: IUserPermission[];

  var component: UpdateUserPermissionsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getUserPermissionsRulesSpy =
      stub(userServiceMock, 'getUserPermissionsModificationRules', () => {
        getUserPermissionsRulesResult = new Subject<IUserPermissionRule[]>();
        return getUserPermissionsRulesResult;
      });

    return [
      provide(UserService, { useValue: userServiceMock }),
      UpdateUserPermissionsComponent
    ];
  });

  beforeEach(inject([UpdateUserPermissionsComponent], (_component: UpdateUserPermissionsComponent) => {
    component = _component;

    userDetails = {
      id: 12321,
      username: 'some username'
    };

    userPermissions = [
      { value: 0, name: 'name1', description: 'description1' },
      { value: 1, name: 'name2', description: 'description2' },
      { value: 2, name: 'name3', description: 'description3' }
    ]

    component.userDetails = userDetails;
    component.userPermissions = userPermissions;

    component.ngOnInit();
  }));

  it('isLoadingUserPermissionsRules should be true', () => {
    expect(component.isLoadingUserPermissionsRules).to.be.true;
  });

  it('loadingUserPermissionsRulesError should be null', () => {
    expect(component.loadingUserPermissionsRulesError).to.be.null;
  });

  it('should call userService.getUserPermissionsModificationRules()', () => {
    expect(getUserPermissionsRulesSpy.callCount).to.be.equal(1);
  });

  it('userPermissionsRules should be null', () => {
    expect(component.userPermissionsRules).to.be.null;
  });

  it('canEditPermission - should return false on every permission', () => {
    userPermissions.forEach((_permission) => {
      expect(component.canEditPermission(_permission)).to.be.false;
    });
  });

  it('hasPermission - should return true on every permission', () => {
    userPermissions.forEach((_permission) => {
      expect(component.hasPermission(_permission)).to.be.true;
    });
  });

  describe('getting user permissions rules fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      getUserPermissionsRulesResult.error(error);
    });

    it('isLoadingUserPermissionsRules should be false', () => {
      expect(component.isLoadingUserPermissionsRules).to.be.false;
    });

    it('loadingUserPermissionsRulesError should be correct', () => {
      expect(component.loadingUserPermissionsRulesError).to.be.equal(error);
    });

    it('userPermissionsRules should be null', () => {
      expect(component.userPermissionsRules).to.be.null;
    });

    it('canEditPermission - should return false on every permission', () => {
      userPermissions.forEach((_permission) => {
        expect(component.canEditPermission(_permission)).to.be.false;
      });
    });

    it('hasPermission - should return true on every permission', () => {
      userPermissions.forEach((_permission) => {
        expect(component.hasPermission(_permission)).to.be.true;
      });
    });

    describe('reload', () => {

      beforeEach(() => {
        getUserPermissionsRulesSpy.reset();

        component.reload();
      });

      it('isLoadingUserPermissionsRules should be true', () => {
        expect(component.isLoadingUserPermissionsRules).to.be.true;
      });

      it('loadingUserPermissionsRulesError should be null', () => {
        expect(component.loadingUserPermissionsRulesError).to.be.null;
      });

      it('should call userService.getUserPermissionsModificationRules()', () => {
        expect(getUserPermissionsRulesSpy.callCount).to.be.equal(1);
      });

      it('userPermissionsRules should be null', () => {
        expect(component.userPermissionsRules).to.be.null;
      });

      it('canEditPermission - should return false on every permission', () => {
        userPermissions.forEach((_permission) => {
          expect(component.canEditPermission(_permission)).to.be.false;
        });
      });

      it('hasPermission - should return true on every permission', () => {
        userPermissions.forEach((_permission) => {
          expect(component.hasPermission(_permission)).to.be.true;
        });
      });

    })

  });

  describe('getting user permissions rules succeeds', () => {

    var userPermissionsRules: IUserPermissionRule[];

    beforeEach(() => {
      userPermissionsRules = [
        { value: 0, name: 'a', description: 'a description', allowedToChange: true },
        { value: 1, name: 'b', description: 'b description', allowedToChange: false },
        { value: 2, name: 'c', description: 'c description', allowedToChange: false },
        { value: 3, name: 'd', description: 'd description', allowedToChange: false }
      ]

      getUserPermissionsRulesResult.next(userPermissionsRules);
      getUserPermissionsRulesResult.complete();
    });

    it('isLoadingUserPermissionsRules should be false', () => {
      expect(component.isLoadingUserPermissionsRules).to.be.false;
    });

    it('loadingUserPermissionsRulesError should be null', () => {
      expect(component.loadingUserPermissionsRulesError).to.be.null;
    });

    it('userPermissionsRules should be correct', () => {
      expect(component.userPermissionsRules).to.deep.equal(userPermissionsRules);
    });

    it('canEditPermission - on allowed should return true', () => {
      expect(component.canEditPermission(userPermissionsRules[0])).to.be.true;
    });

    it('canEditPermission - on not allowed should return false', () => {
      expect(component.canEditPermission(userPermissionsRules[1])).to.be.false;
    });

    it('hasPermission - on permission the user has should return true', () => {
      expect(component.hasPermission(userPermissionsRules[0])).to.be.true;
    });

    it('hasPermission - on permission the user does not have should return false', () => {
      expect(component.hasPermission(userPermissionsRules[3])).to.be.false;
    });

  });

});
