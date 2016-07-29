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
import {provide, NgZone} from '@angular/core';
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
  var zoneRunSpy: SinonSpy;

  var component: UpdateUserPermissionsComponent;

  beforeEachProviders(() => {

    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getUserPermissionsRulesSpy =
      stub(userServiceMock, 'getUserPermissionsModificationRules', () => {
        getUserPermissionsRulesResult = new Subject<IUserPermissionRule[]>();
        return getUserPermissionsRulesResult;
      });

    var zoneMock = {
      run: () => null
    }

    zoneRunSpy = spy(zoneMock, 'run');

    return [
      provide(NgZone, { useValue: zoneMock }),
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

  it('isPermissionsChanged should be false', () => {
    expect(component.isPermissionsChanged()).to.be.false;
  });

  it('isSavingUserPermissions should be false', () => {
    expect(component.isSavingUserPermissions).to.be.false;
  });

  it('savingUserPermissionsError should be null', () => {
    expect(component.savingUserPermissionsError).to.be.null;
  });

  it('cancel should emit cancel event', () => {
    var numberOfTimesEmitted = 0;
    component.cancelEvent.subscribe(() => {
      numberOfTimesEmitted++;
    });

    component.cancel();

    expect(numberOfTimesEmitted).to.be.equal(1);
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

    it('isPermissionsChanged should be false', () => {
      expect(component.isPermissionsChanged()).to.be.false;
    });

    it('isSavingUserPermissions should be false', () => {
      expect(component.isSavingUserPermissions).to.be.false;
    });

    it('savingUserPermissionsError should be null', () => {
      expect(component.savingUserPermissionsError).to.be.null;
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

      it('isPermissionsChanged should be false', () => {
        expect(component.isPermissionsChanged()).to.be.false;
      });

      it('isSavingUserPermissions should be false', () => {
        expect(component.isSavingUserPermissions).to.be.false;
      });

      it('savingUserPermissionsError should be null', () => {
        expect(component.savingUserPermissionsError).to.be.null;
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

    it('isPermissionsChanged should be false', () => {
      expect(component.isPermissionsChanged()).to.be.false;
    });

    it('isSavingUserPermissions should be false', () => {
      expect(component.isSavingUserPermissions).to.be.false;
    });

    it('savingUserPermissionsError should be null', () => {
      expect(component.savingUserPermissionsError).to.be.null;
    });

    describe('change permissions', () => {

      var permissionRuleChangedFromNotHavingToHaving: IUserPermissionRule;
      var permissionRuleChangedFromHavingToNotHaving: IUserPermissionRule;

      beforeEach(() => {
        permissionRuleChangedFromNotHavingToHaving = _.find(userPermissionsRules, _ => !component.hasPermission(_));
        permissionRuleChangedFromHavingToNotHaving = _.find(userPermissionsRules, _ => component.hasPermission(_))

        component.setPermission(permissionRuleChangedFromNotHavingToHaving, true);
        component.setPermission(permissionRuleChangedFromHavingToNotHaving, false);
      });

      it('should set isPermissionsChanged to true', () => {
        expect(component.isPermissionsChanged()).to.be.true;
      });

      it('restore not all permissions should leave isPermissionsChanged being true', () => {
        component.setPermission(permissionRuleChangedFromNotHavingToHaving, false);

        expect(component.isPermissionsChanged()).to.be.true;
      });

      it('restore all permission should change isPermissionsChanged to false', () => {
        component.setPermission(permissionRuleChangedFromNotHavingToHaving, false);
        component.setPermission(permissionRuleChangedFromHavingToNotHaving, true);

        expect(component.isPermissionsChanged()).to.be.false;
      });

      it('isSavingUserPermissions should be false', () => {
        expect(component.isSavingUserPermissions).to.be.false;
      });

      it('savingUserPermissionsError should be null', () => {
        expect(component.savingUserPermissionsError).to.be.null;
      });

      it('should call zone.run', () => {
        expect(zoneRunSpy.callCount).to.be.equal(2);
      })

      describe('save permissions', () => {

        var updateUserPermissionsSpy: SinonSpy;
        var updateUserPermissionsResult: Subject<void>;

        beforeEach(() => {
          userServiceMock.updateUserPermissions = () => {
            updateUserPermissionsResult = new Subject<void>();
            return updateUserPermissionsResult;
          }

          updateUserPermissionsSpy = spy(userServiceMock, 'updateUserPermissions');

          component.savePermissions();
        });

        it('should set isSavingUserPermissions to true', () => {
          expect(component.isSavingUserPermissions).to.be.true;
        });

        it('should call userService.updateUserPermissions correctly', () => {
          expect(updateUserPermissionsSpy.callCount).to.be.equal(1);

          expect(updateUserPermissionsSpy.args[0]).to.be.deep.equal([
            userDetails.id,
            [permissionRuleChangedFromNotHavingToHaving],
            [permissionRuleChangedFromHavingToNotHaving]
          ]);
        });

        it('savingUserPermissionsError should be null', () => {
          expect(component.savingUserPermissionsError).to.be.null;
        });

        describe('saving fails', () => {

          var error: any;

          beforeEach(() => {
            error = 'some error';
            updateUserPermissionsResult.error(error);
          });

          it('should set isSavingUserPermissions to false', () => {
            expect(component.isSavingUserPermissions).to.be.false;
          });

          it('should set savingUserPermissionsError correctly', () => {
            expect(component.savingUserPermissionsError).to.be.equal(error);
          });

          describe('save again', () => {

            beforeEach(() => {
              updateUserPermissionsSpy.reset();

              component.savePermissions();
            });

            it('should set isSavingUserPermissions to true', () => {
              expect(component.isSavingUserPermissions).to.be.true;
            });

            it('should call userService.updateUserPermissions correctly', () => {
              expect(updateUserPermissionsSpy.callCount).to.be.equal(1);

              expect(updateUserPermissionsSpy.args[0]).to.be.deep.equal([
                userDetails.id,
                [permissionRuleChangedFromNotHavingToHaving],
                [permissionRuleChangedFromHavingToNotHaving]
              ]);
            });

            it('savingUserPermissionsError should be null', () => {
              expect(component.savingUserPermissionsError).to.be.null;
            });

          });

        });

        describe('saving succeeds', () => {

          var numberOfTimesUpdatedUserPermissionsEventWasRaised: number;

          beforeEach(() => {
            numberOfTimesUpdatedUserPermissionsEventWasRaised = 0;

            component.updatedUserPermissionsEvent.subscribe(() => {
              numberOfTimesUpdatedUserPermissionsEventWasRaised++;
            });

            updateUserPermissionsResult.next(null);
            updateUserPermissionsResult.complete();
          });

          it('should set isSavingUserPermissions to false', () => {
            expect(component.isSavingUserPermissions).to.be.false;
          });

          it('savingUserPermissionsError should be null', () => {
            expect(component.savingUserPermissionsError).to.be.null;
          });

          it('should set isPermissionsChanged to false', () => {
            expect(component.isPermissionsChanged()).to.be.false;
          });

          it('should emit the updatedUserPermissions event', () => {
            expect(numberOfTimesUpdatedUserPermissionsEventWasRaised).to.be.equal(1);
          });

        })

      });

    });

  });

});
