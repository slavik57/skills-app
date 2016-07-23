"use strict";
var readonlyUserPermissions_component_1 = require("./readonlyUserPermissions.component");
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../../../common/services/userService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
testing_1.describe('ReadonlyUserPermissionsComponent', function () {
    var userServiceMock;
    var getUserPermissionsSpy;
    var getUserPermissionsResult;
    var userDetails;
    var userPermissionsChangedRaises;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getUserPermissionsSpy =
            sinon_1.stub(userServiceMock, 'getUserPermissions', function () {
                getUserPermissionsResult = new Subject_1.Subject();
                return getUserPermissionsResult;
            });
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            readonlyUserPermissions_component_1.ReadonlyUserPermissionsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([readonlyUserPermissions_component_1.ReadonlyUserPermissionsComponent], function (_component) {
        component = _component;
        userDetails = {
            id: 12321,
            username: 'some username'
        };
        component.userDetails = userDetails;
        userPermissionsChangedRaises = [];
        component.userPermissionsChanged.subscribe(function (_userPermissions) {
            userPermissionsChangedRaises.push(_userPermissions);
        });
        component.ngOnInit();
    }));
    testing_1.it('isLoadingUserPermissions should be true', function () {
        chai_1.expect(component.isLoadingUserPermissions).to.be.true;
    });
    testing_1.it('loadingUserPermissionsError should be null', function () {
        chai_1.expect(component.loadingUserPermissionsError).to.be.null;
    });
    testing_1.it('should call userService.getUserPermissions()', function () {
        chai_1.expect(getUserPermissionsSpy.callCount).to.be.equal(1);
        chai_1.expect(getUserPermissionsSpy.args[0]).to.be.deep.equal([userDetails.id]);
    });
    testing_1.it('userPermissions should be null', function () {
        chai_1.expect(component.userPermissions).to.be.null;
    });
    testing_1.it('userPermissionsChanged should exist', function () {
        chai_1.expect(component.userPermissionsChanged).to.exist;
    });
    testing_1.it('userPermissionsChanged should not be raised', function () {
        chai_1.expect(userPermissionsChangedRaises).to.deep.equal([]);
    });
    testing_1.describe('getting user permissions fails', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getUserPermissionsResult.error(error);
        });
        testing_1.it('isLoadingUserPermissions should be false', function () {
            chai_1.expect(component.isLoadingUserPermissions).to.be.false;
        });
        testing_1.it('loadingUserPermissionsError should be correct', function () {
            chai_1.expect(component.loadingUserPermissionsError).to.be.equal(error);
        });
        testing_1.it('userPermissions should be null', function () {
            chai_1.expect(component.userPermissions).to.be.null;
        });
        testing_1.it('userPermissionsChanged should not be raised', function () {
            chai_1.expect(userPermissionsChangedRaises).to.deep.equal([]);
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                getUserPermissionsSpy.reset();
                component.reload();
            });
            testing_1.it('isLoadingUserPermissions should be true', function () {
                chai_1.expect(component.isLoadingUserPermissions).to.be.true;
            });
            testing_1.it('loadingUserPermissionsError should be null', function () {
                chai_1.expect(component.loadingUserPermissionsError).to.be.null;
            });
            testing_1.it('should call userService.getUserPermissions()', function () {
                chai_1.expect(getUserPermissionsSpy.callCount).to.be.equal(1);
                chai_1.expect(getUserPermissionsSpy.args[0]).to.be.deep.equal([userDetails.id]);
            });
            testing_1.it('userPermissions should be null', function () {
                chai_1.expect(component.userPermissions).to.be.null;
            });
            testing_1.it('userPermissionsChanged should not be raised', function () {
                chai_1.expect(userPermissionsChangedRaises).to.deep.equal([]);
            });
        });
    });
    testing_1.describe('getting user permissions succeeds', function () {
        var userPermissions;
        testing_1.beforeEach(function () {
            userPermissions = [
                { value: 0, name: 'a', description: 'a description' },
                { value: 1, name: 'b', description: 'b description' },
                { value: 2, name: 'c', description: 'c description' },
            ];
            getUserPermissionsResult.next(userPermissions);
            getUserPermissionsResult.complete();
        });
        testing_1.it('isLoadingUserPermissions should be false', function () {
            chai_1.expect(component.isLoadingUserPermissions).to.be.false;
        });
        testing_1.it('loadingUserPermissionsError should be null', function () {
            chai_1.expect(component.loadingUserPermissionsError).to.be.null;
        });
        testing_1.it('userPermissions should be correct', function () {
            chai_1.expect(component.userPermissions).to.deep.equal(userPermissions);
        });
        testing_1.it('userPermissionsChanged should be raised correctly', function () {
            chai_1.expect(userPermissionsChangedRaises).to.deep.equal([userPermissions]);
        });
    });
});
//# sourceMappingURL=readonlyUserPermissions.component.test.js.map