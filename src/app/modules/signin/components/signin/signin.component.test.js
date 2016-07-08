"use strict";
var locationService_1 = require("../../../common/services/locationService");
var signin_component_1 = require("./signin.component");
var userService_1 = require("../../../common/services/userService");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
testing_1.describe('SigninComponent', function () {
    var userServiceMock;
    var locationServiceMock;
    var signinComponent;
    var signinUserResult;
    testing_1.beforeEachProviders(function () {
        signinUserResult = new Subject_1.Subject();
        userServiceMock = {
            signinUser: function () { return signinUserResult; },
            isUsernameExists: function () { return null; },
            registerUser: function () { return null; },
            getUserDetails: function () { return null; }
        };
        locationServiceMock = {
            goToUrl: function () { }
        };
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            core_1.provide(locationService_1.LocationService, { useValue: locationServiceMock }),
            signin_component_1.SigninComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([signin_component_1.SigninComponent], function (_signinComponent) {
        signinComponent = _signinComponent;
    }));
    testing_1.it('should be initialized correctly', function () {
        chai_1.expect(signinComponent.error).to.be.null;
        chai_1.expect(signinComponent.model.username).to.be.undefined;
        chai_1.expect(signinComponent.model.password).to.be.undefined;
        chai_1.expect(signinComponent.submitting).to.be.false;
    });
    testing_1.describe('onSubmit', function () {
        var username;
        var password;
        var signinUserSpy;
        testing_1.beforeEach(function () {
            username = 'some username';
            password = 'some passwoed';
            signinComponent.model.username = username;
            signinComponent.model.password = password;
            signinUserSpy = sinon_1.spy(userServiceMock, 'signinUser');
            signinComponent.onSubmit();
        });
        testing_1.it('should set submitting to true', function () {
            chai_1.expect(signinComponent.submitting).to.be.true;
        });
        testing_1.it('should call the service correctly', function () {
            chai_1.expect(signinUserSpy.callCount).to.be.equal(1);
            chai_1.expect(signinUserSpy.args[0][0]).to.be.equal(username);
            chai_1.expect(signinUserSpy.args[0][1]).to.be.equal(password);
        });
        testing_1.describe('user service fails', function () {
            var error;
            testing_1.beforeEach(function () {
                error = 'some error';
                signinUserResult.error(error);
            });
            testing_1.it('should set submitting to false', function () {
                chai_1.expect(signinComponent.submitting).to.be.false;
            });
            testing_1.it('should set the error correctly', function () {
                chai_1.expect(signinComponent.error).to.be.equal(error);
            });
        });
        testing_1.describe('user service succeeds', function () {
            var redirectUrl;
            var goToUrlSpy;
            testing_1.beforeEach(function () {
                redirectUrl = 'some url';
                goToUrlSpy = sinon_1.spy(locationServiceMock, 'goToUrl');
                signinUserResult.next(redirectUrl);
                signinUserResult.complete();
            });
            testing_1.it('should set submitting to true', function () {
                chai_1.expect(signinComponent.submitting).to.be.true;
            });
            testing_1.it('should navigate to correct url', function () {
                chai_1.expect(goToUrlSpy.args[0][0]).to.be.equal(redirectUrl);
            });
        });
    });
});
//# sourceMappingURL=signin.component.test.js.map