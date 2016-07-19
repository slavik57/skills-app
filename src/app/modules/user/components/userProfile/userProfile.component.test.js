"use strict";
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var userService_1 = require("../../../common/services/userService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var userProfile_component_1 = require('./userProfile.component');
var Subject_1 = require('rxjs/Subject');
testing_1.describe('UserProfileComponent', function () {
    var userServiceMock;
    var component;
    var getUserDetailsSpy;
    var getUserDetailsResult;
    testing_1.beforeEachProviders(function () {
        getUserDetailsResult = new Subject_1.Subject();
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        userServiceMock.getUserDetails = function () { return getUserDetailsResult; };
        getUserDetailsSpy = sinon_1.spy(userServiceMock, 'getUserDetails');
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            userProfile_component_1.UserProfileComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([userProfile_component_1.UserProfileComponent], function (_component) {
        component = _component;
        component.ngOnInit();
    }));
    testing_1.it('should initialize correctly', function () {
        chai_1.expect(component.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
        chai_1.expect(component.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
        chai_1.expect(component.userDetails, 'userDetails should be correct').to.be.undefined;
    });
    testing_1.it('should fetch userDetails', function () {
        chai_1.expect(getUserDetailsSpy.callCount).to.be.equal(1);
    });
    testing_1.describe('fetching user details failed', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getUserDetailsResult.error(error);
        });
        testing_1.it('should set gettingUserDetails to false', function () {
            chai_1.expect(component.gettingUserDetails).to.be.false;
        });
        testing_1.it('userDetails should still be undefined', function () {
            chai_1.expect(component.userDetails).to.be.undefined;
        });
        testing_1.it('should set error correctly', function () {
            chai_1.expect(component.gettingUserDetailsError).to.be.equal(error);
        });
        testing_1.describe('reload user details', function () {
            testing_1.beforeEach(function () {
                getUserDetailsSpy.reset();
                getUserDetailsResult = new Subject_1.Subject();
                component.loadUserDetails();
            });
            testing_1.it('should set properties correctly', function () {
                chai_1.expect(component.gettingUserDetails, 'gettingUserDetails should be correct').to.be.true;
                chai_1.expect(component.gettingUserDetailsError, 'gettingUserDetailsError should be correct').to.be.null;
                chai_1.expect(component.userDetails, 'userDetails should be correct').to.be.undefined;
            });
            testing_1.it('should fetch userDetails', function () {
                chai_1.expect(getUserDetailsSpy.callCount).to.be.equal(1);
            });
        });
    });
    testing_1.describe('fetching user details succeeds', function () {
        var userDetails;
        testing_1.beforeEach(function () {
            userDetails = {
                id: 1,
                username: 'some username',
                email: 'some@email.com',
                firstName: 'some firstName',
                lastName: 'some lastName'
            };
            getUserDetailsResult.next(userDetails);
            getUserDetailsResult.complete();
        });
        testing_1.it('should set gettingUserDetails to false', function () {
            chai_1.expect(component.gettingUserDetails).to.be.false;
        });
        testing_1.it('should set error correctly', function () {
            chai_1.expect(component.gettingUserDetailsError).to.be.null;
        });
        testing_1.it('the userDetails should be correct', function () {
            chai_1.expect(component.userDetails).to.be.deep.equal(userDetails);
        });
    });
    testing_1.describe('fetching user details succeeds with null email', function () {
        var userDetails;
        testing_1.beforeEach(function () {
            userDetails = {
                id: 1,
                username: 'some username',
                email: null,
                firstName: 'some firstName',
                lastName: 'some lastName'
            };
            getUserDetailsResult.next(userDetails);
            getUserDetailsResult.complete();
        });
        testing_1.it('should set gettingUserDetails to false', function () {
            chai_1.expect(component.gettingUserDetails).to.be.false;
        });
        testing_1.it('should set error correctly', function () {
            chai_1.expect(component.gettingUserDetailsError).to.be.null;
        });
        testing_1.it('the userDetails should be correct', function () {
            chai_1.expect(component.userDetails).to.be.deep.equal(userDetails);
        });
    });
});
//# sourceMappingURL=userProfile.component.test.js.map