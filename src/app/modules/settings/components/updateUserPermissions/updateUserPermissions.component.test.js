"use strict";
var updateUserPermissions_component_1 = require("./updateUserPermissions.component");
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../../../common/services/userService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
testing_1.describe('ReadonlyUserPermissionsComponent', function () {
    var userServiceMock;
    var getUserPermissionsRulesSpy;
    var getUserPermissionsRulesResult;
    var userDetails;
    var userPermissions;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getUserPermissionsRulesSpy =
            sinon_1.stub(userServiceMock, 'getUserPermissionsModificationRules', function () {
                getUserPermissionsRulesResult = new Subject_1.Subject();
                return getUserPermissionsRulesResult;
            });
        return [
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
        });
    });
    testing_1.describe('getting user permissions rules succeeds', function () {
        var userPermissionsRules;
        testing_1.beforeEach(function () {
            userPermissionsRules = [
                { value: 0, name: 'a', description: 'a description', allowedToChange: true },
                { value: 1, name: 'b', description: 'b description', allowedToChange: false },
                { value: 2, name: 'c', description: 'c description', allowedToChange: false }
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
            chai_1.expect(component.canEditPermission(userPermissions[0])).to.be.true;
        });
        testing_1.it('canEditPermission - on not allowed should return false', function () {
            chai_1.expect(component.canEditPermission(userPermissions[1])).to.be.false;
        });
    });
});
//# sourceMappingURL=updateUserPermissions.component.test.js.map