"use strict";
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var userSettings_component_1 = require('./userSettings.component');
var userService_1 = require("../../../common/services/userService");
var Subject_1 = require('rxjs/Subject');
testing_1.describe('UserSettingsComponent', function () {
    var userServiceMock;
    var userDetails;
    var canUserUpdatePasswordSpy;
    var canUserUpdatePasswordResult;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        canUserUpdatePasswordSpy =
            sinon_1.stub(userServiceMock, 'canUserUpdatePassword', function () {
                canUserUpdatePasswordResult = new Subject_1.Subject();
                return canUserUpdatePasswordResult;
            });
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            userSettings_component_1.UserSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([userSettings_component_1.UserSettingsComponent], function (_component) {
        component = _component;
        userDetails = {
            id: 12321,
            username: 'some username'
        };
        component.userDetails = userDetails;
        component.availableUserSettings = {
            nativeElement: {}
        };
        component.ngOnInit();
    }));
    testing_1.describe('ngAfterViewInit', function () {
        var jquerySpy;
        var jqueryResultTabsSpy;
        testing_1.beforeEach(function () {
            var jqueryResult = {
                tabs: function () { return null; }
            };
            jqueryResultTabsSpy = sinon_1.spy(jqueryResult, 'tabs');
            jquerySpy = sinon_1.stub(window, '$', function () {
                return jqueryResult;
            });
            component.ngAfterViewInit();
        });
        afterEach(function () {
            jquerySpy.restore();
        });
        testing_1.it('should initialize tabs', function () {
            chai_1.expect(jquerySpy.callCount).to.be.equal(1);
            chai_1.expect(jquerySpy.args[0]).to.be.length(1);
            chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.availableUserSettings.nativeElement);
            chai_1.expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
        });
    });
    testing_1.it('isCheckingCanUserUpdatePassword should be true', function () {
        chai_1.expect(component.isCheckingCanUserUpdatePassword).to.be.true;
    });
    testing_1.it('userUpdatePasswordCheckError should be null', function () {
        chai_1.expect(component.userUpdatePasswordCheckError).to.be.null;
    });
    testing_1.it('should call userService.canUserUpdatePassword()', function () {
        chai_1.expect(canUserUpdatePasswordSpy.callCount).to.be.equal(1);
        chai_1.expect(canUserUpdatePasswordSpy.args[0]).to.be.deep.equal([userDetails.id]);
    });
    testing_1.it('canUserUpdatePassword should be false', function () {
        chai_1.expect(component.canUserUpdatePassword).to.be.false;
    });
    testing_1.describe('checking if user can update password fails', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            canUserUpdatePasswordResult.error(error);
        });
        testing_1.it('isCheckingCanUserUpdatePassword should be false', function () {
            chai_1.expect(component.isCheckingCanUserUpdatePassword).to.be.false;
        });
        testing_1.it('userUpdatePasswordCheckError should be correct', function () {
            chai_1.expect(component.userUpdatePasswordCheckError).to.be.equal(error);
        });
        testing_1.it('canUserUpdatePassword should be false', function () {
            chai_1.expect(component.canUserUpdatePassword).to.be.false;
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                canUserUpdatePasswordSpy.reset();
                component.reload();
            });
            testing_1.it('isCheckingCanUserUpdatePassword should be true', function () {
                chai_1.expect(component.isCheckingCanUserUpdatePassword).to.be.true;
            });
            testing_1.it('userUpdatePasswordCheckError should be null', function () {
                chai_1.expect(component.userUpdatePasswordCheckError).to.be.null;
            });
            testing_1.it('should call userService.canUserUpdatePassword()', function () {
                chai_1.expect(canUserUpdatePasswordSpy.callCount).to.be.equal(1);
                chai_1.expect(canUserUpdatePasswordSpy.args[0]).to.be.deep.equal([userDetails.id]);
            });
            testing_1.it('canUserUpdatePassword should be false', function () {
                chai_1.expect(component.canUserUpdatePassword).to.be.false;
            });
        });
    });
    testing_1.describe('getting user permissions succeeds with false', function () {
        testing_1.beforeEach(function () {
            canUserUpdatePasswordResult.next(false);
            canUserUpdatePasswordResult.complete();
        });
        testing_1.it('isCheckingCanUserUpdatePassword should be false', function () {
            chai_1.expect(component.isCheckingCanUserUpdatePassword).to.be.false;
        });
        testing_1.it('userUpdatePasswordCheckError should be null', function () {
            chai_1.expect(component.userUpdatePasswordCheckError).to.be.null;
        });
        testing_1.it('canUserUpdatePassword should be false', function () {
            chai_1.expect(component.canUserUpdatePassword).to.be.false;
        });
    });
    testing_1.describe('getting user permissions succeeds with true', function () {
        testing_1.beforeEach(function () {
            canUserUpdatePasswordResult.next(true);
            canUserUpdatePasswordResult.complete();
        });
        testing_1.it('isCheckingCanUserUpdatePassword should be false', function () {
            chai_1.expect(component.isCheckingCanUserUpdatePassword).to.be.false;
        });
        testing_1.it('userUpdatePasswordCheckError should be null', function () {
            chai_1.expect(component.userUpdatePasswordCheckError).to.be.null;
        });
        testing_1.it('canUserUpdatePassword should be true', function () {
            chai_1.expect(component.canUserUpdatePassword).to.be.true;
        });
    });
});
//# sourceMappingURL=userSettings.component.test.js.map