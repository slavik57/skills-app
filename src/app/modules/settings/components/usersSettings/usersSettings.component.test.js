"use strict";
var usersSettings_component_1 = require("./usersSettings.component");
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var userService_1 = require("../../../common/services/userService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var _ = require('lodash');
testing_1.describe('UsersSettingsComponent', function () {
    var userServiceMock;
    var getUsersDetailsSpy;
    var getUsersDetailsResult;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getUsersDetailsSpy =
            sinon_1.stub(userServiceMock, 'getUsersDetails', function () {
                getUsersDetailsResult = new Subject_1.Subject();
                return getUsersDetailsResult;
            });
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            usersSettings_component_1.UsersSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([usersSettings_component_1.UsersSettingsComponent], function (_component) {
        component = _component;
        component.userDetailsList = {
            nativeElement: {}
        };
        var jqueryResult = {
            collapsible: function () { return null; }
        };
        component.ngOnInit();
    }));
    testing_1.it('isLoadingUsers should be true', function () {
        chai_1.expect(component.isLoadingUsers).to.be.true;
    });
    testing_1.it('loadingUsersError should be null', function () {
        chai_1.expect(component.loadingUsersError).to.be.null;
    });
    testing_1.it('should call userService.getUsersDetails()', function () {
        chai_1.expect(getUsersDetailsSpy.callCount).to.be.equal(1);
    });
    testing_1.it('usersDetails should be null', function () {
        chai_1.expect(component.usersDetails).to.be.null;
    });
    testing_1.describe('getting users details fails', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getUsersDetailsResult.error(error);
        });
        testing_1.it('isLoadingUsers should be false', function () {
            chai_1.expect(component.isLoadingUsers).to.be.false;
        });
        testing_1.it('loadingUsersError should be correct', function () {
            chai_1.expect(component.loadingUsersError).to.be.equal(error);
        });
        testing_1.it('usersDetails should be null', function () {
            chai_1.expect(component.usersDetails).to.be.null;
        });
        testing_1.describe('reloadUserDetails', function () {
            testing_1.beforeEach(function () {
                getUsersDetailsSpy.reset();
                component.reloadUsersDetails();
            });
            testing_1.it('isLoadingUsers should be true', function () {
                chai_1.expect(component.isLoadingUsers).to.be.true;
            });
            testing_1.it('loadingUsersError should be null', function () {
                chai_1.expect(component.loadingUsersError).to.be.null;
            });
            testing_1.it('should call userService.getUsersDetails()', function () {
                chai_1.expect(getUsersDetailsSpy.callCount).to.be.equal(1);
            });
            testing_1.it('usersDetails should be null', function () {
                chai_1.expect(component.usersDetails).to.be.null;
            });
        });
    });
    testing_1.describe('getting users details succeeds', function () {
        var usersDetails;
        testing_1.beforeEach(testing_1.fakeAsync(function () {
            usersDetails =
                _.map([1, 2, 3], function (_id) {
                    return { id: _id, username: _id.toString() };
                });
            getUsersDetailsResult.next(usersDetails);
            getUsersDetailsResult.complete();
            testing_1.tick(0);
        }));
        testing_1.it('isLoadingUsers should be false', function () {
            chai_1.expect(component.isLoadingUsers).to.be.false;
        });
        testing_1.it('loadingUsersError should be null', function () {
            chai_1.expect(component.loadingUsersError).to.be.null;
        });
        testing_1.it('usersDetails should be correct', function () {
            chai_1.expect(component.usersDetails).to.deep.equal(usersDetails);
        });
    });
});
//# sourceMappingURL=usersSettings.component.test.js.map