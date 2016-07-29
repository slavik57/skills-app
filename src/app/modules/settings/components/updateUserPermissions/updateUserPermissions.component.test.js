"use strict";
var updateUserPermissions_component_1 = require("./updateUserPermissions.component");
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../../../common/services/userService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var _ = require('lodash');
testing_1.describe('ReadonlyUserPermissionsComponent', function () {
    var userServiceMock;
    var getUserPermissionsRulesSpy;
    var getUserPermissionsRulesResult;
    var userDetails;
    var userPermissions;
    var zoneRunSpy;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getUserPermissionsRulesSpy =
            sinon_1.stub(userServiceMock, 'getUserPermissionsModificationRules', function () {
                getUserPermissionsRulesResult = new Subject_1.Subject();
                return getUserPermissionsRulesResult;
            });
        var zoneMock = {
            run: function () { return null; }
        };
        zoneRunSpy = sinon_1.spy(zoneMock, 'run');
        return [
            core_1.provide(core_1.NgZone, { useValue: zoneMock }),
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            updateUserPermissions_component_1.UpdateUserPermissionsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([updateUserPermissions_component_1.UpdateUserPermissionsComponent], function (_component) {
        component = _component;
        userDetails = {
            id: 12321,
            username: 'some username'
        };
        userPermissions = [
            { value: 0, name: 'name1', description: 'description1' },
            { value: 1, name: 'name2', description: 'description2' },
            { value: 2, name: 'name3', description: 'description3' }
        ];
        component.userDetails = userDetails;
        component.userPermissions = userPermissions;
        component.ngOnInit();
    }));
    testing_1.it('isLoadingUserPermissionsRules should be true', function () {
        chai_1.expect(component.isLoadingUserPermissionsRules).to.be.true;
    });
    testing_1.it('loadingUserPermissionsRulesError should be null', function () {
        chai_1.expect(component.loadingUserPermissionsRulesError).to.be.null;
    });
    testing_1.it('should call userService.getUserPermissionsModificationRules()', function () {
        chai_1.expect(getUserPermissionsRulesSpy.callCount).to.be.equal(1);
    });
    testing_1.it('userPermissionsRules should be null', function () {
        chai_1.expect(component.userPermissionsRules).to.be.null;
    });
    testing_1.it('canEditPermission - should return false on every permission', function () {
        userPermissions.forEach(function (_permission) {
            chai_1.expect(component.canEditPermission(_permission)).to.be.false;
        });
    });
    testing_1.it('hasPermission - should return true on every permission', function () {
        userPermissions.forEach(function (_permission) {
            chai_1.expect(component.hasPermission(_permission)).to.be.true;
        });
    });
    testing_1.it('isPermissionsChanged should be false', function () {
        chai_1.expect(component.isPermissionsChanged()).to.be.false;
    });
    testing_1.it('isSavingUserPermissions should be false', function () {
        chai_1.expect(component.isSavingUserPermissions).to.be.false;
    });
    testing_1.it('savingUserPermissionsError should be null', function () {
        chai_1.expect(component.savingUserPermissionsError).to.be.null;
    });
    testing_1.it('cancel should emit cancel event', function () {
        var numberOfTimesEmitted = 0;
        component.cancelEvent.subscribe(function () {
            numberOfTimesEmitted++;
        });
        component.cancel();
        chai_1.expect(numberOfTimesEmitted).to.be.equal(1);
    });
    testing_1.describe('getting user permissions rules fails', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getUserPermissionsRulesResult.error(error);
        });
        testing_1.it('isLoadingUserPermissionsRules should be false', function () {
            chai_1.expect(component.isLoadingUserPermissionsRules).to.be.false;
        });
        testing_1.it('loadingUserPermissionsRulesError should be correct', function () {
            chai_1.expect(component.loadingUserPermissionsRulesError).to.be.equal(error);
        });
        testing_1.it('userPermissionsRules should be null', function () {
            chai_1.expect(component.userPermissionsRules).to.be.null;
        });
        testing_1.it('canEditPermission - should return false on every permission', function () {
            userPermissions.forEach(function (_permission) {
                chai_1.expect(component.canEditPermission(_permission)).to.be.false;
            });
        });
        testing_1.it('hasPermission - should return true on every permission', function () {
            userPermissions.forEach(function (_permission) {
                chai_1.expect(component.hasPermission(_permission)).to.be.true;
            });
        });
        testing_1.it('isPermissionsChanged should be false', function () {
            chai_1.expect(component.isPermissionsChanged()).to.be.false;
        });
        testing_1.it('isSavingUserPermissions should be false', function () {
            chai_1.expect(component.isSavingUserPermissions).to.be.false;
        });
        testing_1.it('savingUserPermissionsError should be null', function () {
            chai_1.expect(component.savingUserPermissionsError).to.be.null;
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                getUserPermissionsRulesSpy.reset();
                component.reload();
            });
            testing_1.it('isLoadingUserPermissionsRules should be true', function () {
                chai_1.expect(component.isLoadingUserPermissionsRules).to.be.true;
            });
            testing_1.it('loadingUserPermissionsRulesError should be null', function () {
                chai_1.expect(component.loadingUserPermissionsRulesError).to.be.null;
            });
            testing_1.it('should call userService.getUserPermissionsModificationRules()', function () {
                chai_1.expect(getUserPermissionsRulesSpy.callCount).to.be.equal(1);
            });
            testing_1.it('userPermissionsRules should be null', function () {
                chai_1.expect(component.userPermissionsRules).to.be.null;
            });
            testing_1.it('canEditPermission - should return false on every permission', function () {
                userPermissions.forEach(function (_permission) {
                    chai_1.expect(component.canEditPermission(_permission)).to.be.false;
                });
            });
            testing_1.it('hasPermission - should return true on every permission', function () {
                userPermissions.forEach(function (_permission) {
                    chai_1.expect(component.hasPermission(_permission)).to.be.true;
                });
            });
            testing_1.it('isPermissionsChanged should be false', function () {
                chai_1.expect(component.isPermissionsChanged()).to.be.false;
            });
            testing_1.it('isSavingUserPermissions should be false', function () {
                chai_1.expect(component.isSavingUserPermissions).to.be.false;
            });
            testing_1.it('savingUserPermissionsError should be null', function () {
                chai_1.expect(component.savingUserPermissionsError).to.be.null;
            });
        });
    });
    testing_1.describe('getting user permissions rules succeeds', function () {
        var userPermissionsRules;
        testing_1.beforeEach(function () {
            userPermissionsRules = [
                { value: 0, name: 'a', description: 'a description', allowedToChange: true },
                { value: 1, name: 'b', description: 'b description', allowedToChange: false },
                { value: 2, name: 'c', description: 'c description', allowedToChange: false },
                { value: 3, name: 'd', description: 'd description', allowedToChange: false }
            ];
            getUserPermissionsRulesResult.next(userPermissionsRules);
            getUserPermissionsRulesResult.complete();
        });
        testing_1.it('isLoadingUserPermissionsRules should be false', function () {
            chai_1.expect(component.isLoadingUserPermissionsRules).to.be.false;
        });
        testing_1.it('loadingUserPermissionsRulesError should be null', function () {
            chai_1.expect(component.loadingUserPermissionsRulesError).to.be.null;
        });
        testing_1.it('userPermissionsRules should be correct', function () {
            chai_1.expect(component.userPermissionsRules).to.deep.equal(userPermissionsRules);
        });
        testing_1.it('canEditPermission - on allowed should return true', function () {
            chai_1.expect(component.canEditPermission(userPermissionsRules[0])).to.be.true;
        });
        testing_1.it('canEditPermission - on not allowed should return false', function () {
            chai_1.expect(component.canEditPermission(userPermissionsRules[1])).to.be.false;
        });
        testing_1.it('hasPermission - on permission the user has should return true', function () {
            chai_1.expect(component.hasPermission(userPermissionsRules[0])).to.be.true;
        });
        testing_1.it('hasPermission - on permission the user does not have should return false', function () {
            chai_1.expect(component.hasPermission(userPermissionsRules[3])).to.be.false;
        });
        testing_1.it('isPermissionsChanged should be false', function () {
            chai_1.expect(component.isPermissionsChanged()).to.be.false;
        });
        testing_1.it('isSavingUserPermissions should be false', function () {
            chai_1.expect(component.isSavingUserPermissions).to.be.false;
        });
        testing_1.it('savingUserPermissionsError should be null', function () {
            chai_1.expect(component.savingUserPermissionsError).to.be.null;
        });
        testing_1.describe('change permissions', function () {
            var permissionRuleChangedFromNotHavingToHaving;
            var permissionRuleChangedFromHavingToNotHaving;
            testing_1.beforeEach(function () {
                permissionRuleChangedFromNotHavingToHaving = _.find(userPermissionsRules, function (_) { return !component.hasPermission(_); });
                permissionRuleChangedFromHavingToNotHaving = _.find(userPermissionsRules, function (_) { return component.hasPermission(_); });
                component.setPermission(permissionRuleChangedFromNotHavingToHaving, true);
                component.setPermission(permissionRuleChangedFromHavingToNotHaving, false);
            });
            testing_1.it('should set isPermissionsChanged to true', function () {
                chai_1.expect(component.isPermissionsChanged()).to.be.true;
            });
            testing_1.it('restore not all permissions should leave isPermissionsChanged being true', function () {
                component.setPermission(permissionRuleChangedFromNotHavingToHaving, false);
                chai_1.expect(component.isPermissionsChanged()).to.be.true;
            });
            testing_1.it('restore all permission should change isPermissionsChanged to false', function () {
                component.setPermission(permissionRuleChangedFromNotHavingToHaving, false);
                component.setPermission(permissionRuleChangedFromHavingToNotHaving, true);
                chai_1.expect(component.isPermissionsChanged()).to.be.false;
            });
            testing_1.it('isSavingUserPermissions should be false', function () {
                chai_1.expect(component.isSavingUserPermissions).to.be.false;
            });
            testing_1.it('savingUserPermissionsError should be null', function () {
                chai_1.expect(component.savingUserPermissionsError).to.be.null;
            });
            testing_1.it('should call zone.run', function () {
                chai_1.expect(zoneRunSpy.callCount).to.be.equal(2);
            });
            testing_1.describe('save permissions', function () {
                var updateUserPermissionsSpy;
                var updateUserPermissionsResult;
                testing_1.beforeEach(function () {
                    userServiceMock.updateUserPermissions = function () {
                        updateUserPermissionsResult = new Subject_1.Subject();
                        return updateUserPermissionsResult;
                    };
                    updateUserPermissionsSpy = sinon_1.spy(userServiceMock, 'updateUserPermissions');
                    component.savePermissions();
                });
                testing_1.it('should set isSavingUserPermissions to true', function () {
                    chai_1.expect(component.isSavingUserPermissions).to.be.true;
                });
                testing_1.it('should call userService.updateUserPermissions correctly', function () {
                    chai_1.expect(updateUserPermissionsSpy.callCount).to.be.equal(1);
                    chai_1.expect(updateUserPermissionsSpy.args[0]).to.be.deep.equal([
                        userDetails.id,
                        [permissionRuleChangedFromNotHavingToHaving],
                        [permissionRuleChangedFromHavingToNotHaving]
                    ]);
                });
                testing_1.it('savingUserPermissionsError should be null', function () {
                    chai_1.expect(component.savingUserPermissionsError).to.be.null;
                });
                testing_1.describe('saving fails', function () {
                    var error;
                    testing_1.beforeEach(function () {
                        error = 'some error';
                        updateUserPermissionsResult.error(error);
                    });
                    testing_1.it('should set isSavingUserPermissions to false', function () {
                        chai_1.expect(component.isSavingUserPermissions).to.be.false;
                    });
                    testing_1.it('should set savingUserPermissionsError correctly', function () {
                        chai_1.expect(component.savingUserPermissionsError).to.be.equal(error);
                    });
                    testing_1.describe('save again', function () {
                        testing_1.beforeEach(function () {
                            updateUserPermissionsSpy.reset();
                            component.savePermissions();
                        });
                        testing_1.it('should set isSavingUserPermissions to true', function () {
                            chai_1.expect(component.isSavingUserPermissions).to.be.true;
                        });
                        testing_1.it('should call userService.updateUserPermissions correctly', function () {
                            chai_1.expect(updateUserPermissionsSpy.callCount).to.be.equal(1);
                            chai_1.expect(updateUserPermissionsSpy.args[0]).to.be.deep.equal([
                                userDetails.id,
                                [permissionRuleChangedFromNotHavingToHaving],
                                [permissionRuleChangedFromHavingToNotHaving]
                            ]);
                        });
                        testing_1.it('savingUserPermissionsError should be null', function () {
                            chai_1.expect(component.savingUserPermissionsError).to.be.null;
                        });
                    });
                });
                testing_1.describe('saving succeeds', function () {
                    var numberOfTimesUpdatedUserPermissionsEventWasRaised;
                    testing_1.beforeEach(function () {
                        numberOfTimesUpdatedUserPermissionsEventWasRaised = 0;
                        component.updatedUserPermissionsEvent.subscribe(function () {
                            numberOfTimesUpdatedUserPermissionsEventWasRaised++;
                        });
                        updateUserPermissionsResult.next(null);
                        updateUserPermissionsResult.complete();
                    });
                    testing_1.it('should set isSavingUserPermissions to false', function () {
                        chai_1.expect(component.isSavingUserPermissions).to.be.false;
                    });
                    testing_1.it('savingUserPermissionsError should be null', function () {
                        chai_1.expect(component.savingUserPermissionsError).to.be.null;
                    });
                    testing_1.it('should set isPermissionsChanged to false', function () {
                        chai_1.expect(component.isPermissionsChanged()).to.be.false;
                    });
                    testing_1.it('should emit the updatedUserPermissions event', function () {
                        chai_1.expect(numberOfTimesUpdatedUserPermissionsEventWasRaised).to.be.equal(1);
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=updateUserPermissions.component.test.js.map