"use strict";
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var skillSettings_component_1 = require('./skillSettings.component');
var userService_1 = require("../../../common/services/userService");
var Subject_1 = require('rxjs/Subject');
testing_1.describe('SkillSettingsComponent', function () {
    var userServiceMock;
    var skillDetails;
    var getSkillModificationPermissionsResult;
    var getSkillModificationPermissionsSpy;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getSkillModificationPermissionsSpy =
            sinon_1.stub(userServiceMock, 'getSkillModificationPermissions', function () {
                getSkillModificationPermissionsResult = new Subject_1.Subject();
                return getSkillModificationPermissionsResult;
            });
        return [
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            skillSettings_component_1.SkillSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillSettings_component_1.SkillSettingsComponent], function (_component) {
        component = _component;
        skillDetails = {
            id: 12321,
            skillName: 'some skill name'
        };
        component.skillDetails = skillDetails;
        component.availableSkillSettings = {
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
        testing_1.it('should call userService.getSkillModificationPermissions()', function () {
            chai_1.expect(getSkillModificationPermissionsSpy.callCount).to.be.equal(1);
            chai_1.expect(getSkillModificationPermissionsSpy.args[0]).to.deep.equal([skillDetails.id]);
        });
        testing_1.describe('getting skill modification permissions fails', function () {
            var error;
            testing_1.beforeEach(testing_1.fakeAsync(function () {
                error = 'some error';
                getSkillModificationPermissionsResult.error(error);
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
                    getSkillModificationPermissionsSpy.reset();
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
                testing_1.it('should call userService.getSkillModificationPermissions()', function () {
                    chai_1.expect(getSkillModificationPermissionsSpy.callCount).to.be.equal(1);
                    chai_1.expect(getSkillModificationPermissionsSpy.args[0]).to.deep.equal([skillDetails.id]);
                });
            });
        });
        testing_1.describe('getting skill modification permissions succeeds', function () {
            var permissions;
            testing_1.beforeEach(testing_1.fakeAsync(function () {
                permissions = {
                    canModifyPrerequisites: true,
                    canModifyDependencies: false
                };
                getSkillModificationPermissionsResult.next(permissions);
                getSkillModificationPermissionsResult.complete();
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
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.availableSkillSettings.nativeElement);
                chai_1.expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
            });
        });
    });
});
//# sourceMappingURL=skillSettings.component.test.js.map