"use strict";
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var teamSettings_component_1 = require('./teamSettings.component');
var userService_1 = require("../../../common/services/userService");
var Subject_1 = require('rxjs/Subject');
testing_1.describe('TeamSettingsComponent', function () {
    var userServiceMock;
    var teamDetails;
    var getTeamModificationPermissionsResult;
    var getTeamModificationPermissionsSpy;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getTeamModificationPermissionsSpy =
            sinon_1.stub(userServiceMock, 'getTeamModificationPermissions', function () {
                getTeamModificationPermissionsResult = new Subject_1.Subject();
                return getTeamModificationPermissionsResult;
            });
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            teamSettings_component_1.TeamSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([teamSettings_component_1.TeamSettingsComponent], function (_component) {
        component = _component;
        teamDetails = {
            id: 12321,
            teamName: 'some team name'
        };
        component.teamDetails = teamDetails;
        component.availableTeamSettings = {
            nativeElement: {}
        };
    }));
    testing_1.describe('ngOnInit', function () {
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
            component.ngOnInit();
        });
        afterEach(function () {
            jquerySpy.restore();
        });
        testing_1.it('isLoadingPermissions should be true', function () {
            chai_1.expect(component.isLoadingPermissions).to.be.true;
        });
        testing_1.it('loadingPermissionsError should be null', function () {
            chai_1.expect(component.loadingPermissionsError).to.be.null;
        });
        testing_1.it('permissions should be null', function () {
            chai_1.expect(component.permissions).to.be.null;
        });
        testing_1.it('should not initialize tabs', function () {
            chai_1.expect(jquerySpy.callCount).to.be.equal(0);
        });
        testing_1.it('should call userService.getTeamModificationPermissions()', function () {
            chai_1.expect(getTeamModificationPermissionsSpy.callCount).to.be.equal(1);
            chai_1.expect(getTeamModificationPermissionsSpy.args[0]).to.deep.equal([teamDetails.id]);
        });
        testing_1.describe('getting team modification permissions fails', function () {
            var error;
            testing_1.beforeEach(testing_1.fakeAsync(function () {
                error = 'some error';
                getTeamModificationPermissionsResult.error(error);
                testing_1.tick(0);
            }));
            testing_1.it('isLoadingPermissions should be false', function () {
                chai_1.expect(component.isLoadingPermissions).to.be.false;
            });
            testing_1.it('loadingPermissionsError should be correct', function () {
                chai_1.expect(component.loadingPermissionsError).to.be.equal(error);
            });
            testing_1.it('permissions should be null', function () {
                chai_1.expect(component.permissions).to.be.null;
            });
            testing_1.it('should not initialize tabs', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(0);
            });
            testing_1.describe('reload', function () {
                testing_1.beforeEach(function () {
                    getTeamModificationPermissionsSpy.reset();
                    component.reload();
                });
                testing_1.it('isLoadingPermissions should be true', function () {
                    chai_1.expect(component.isLoadingPermissions).to.be.true;
                });
                testing_1.it('loadingPermissionsError should be null', function () {
                    chai_1.expect(component.loadingPermissionsError).to.be.null;
                });
                testing_1.it('permissions should be null', function () {
                    chai_1.expect(component.permissions).to.be.null;
                });
                testing_1.it('should not initialize tabs', function () {
                    chai_1.expect(jquerySpy.callCount).to.be.equal(0);
                });
                testing_1.it('should call userService.getTeamModificationPermissions()', function () {
                    chai_1.expect(getTeamModificationPermissionsSpy.callCount).to.be.equal(1);
                    chai_1.expect(getTeamModificationPermissionsSpy.args[0]).to.deep.equal([teamDetails.id]);
                });
            });
        });
        testing_1.describe('getting team modification permissions succeeds', function () {
            var permissions;
            testing_1.beforeEach(testing_1.fakeAsync(function () {
                permissions = {
                    canModifyTeamName: true,
                    canModifyTeamAdmins: false,
                    canModifyTeamUsers: true
                };
                getTeamModificationPermissionsResult.next(permissions);
                getTeamModificationPermissionsResult.complete();
                testing_1.tick(0);
            }));
            testing_1.it('isLoadingPermissions should be false', function () {
                chai_1.expect(component.isLoadingPermissions).to.be.false;
            });
            testing_1.it('loadingPermissionsError should be null', function () {
                chai_1.expect(component.loadingPermissionsError).to.be.null;
            });
            testing_1.it('permissions should be correct', function () {
                chai_1.expect(component.permissions).to.be.equal(permissions);
            });
            testing_1.it('should initialize tabs', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0]).to.be.length(1);
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.availableTeamSettings.nativeElement);
                chai_1.expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
            });
        });
    });
});
//# sourceMappingURL=teamSettings.component.test.js.map