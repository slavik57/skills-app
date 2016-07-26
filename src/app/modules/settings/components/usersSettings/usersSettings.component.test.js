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
    var zoneMock;
    var zoneRunSpy;
    var component;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        getUsersDetailsSpy =
            sinon_1.stub(userServiceMock, 'getUsersDetails', function () {
                getUsersDetailsResult = new Subject_1.Subject();
                return getUsersDetailsResult;
            });
        zoneMock = {
            run: function () { return null; }
        };
        zoneRunSpy = sinon_1.spy(zoneMock, 'run');
        return [
            core_1.provide(core_1.NgZone, { useValue: zoneMock }),
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            usersSettings_component_1.UsersSettingsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([usersSettings_component_1.UsersSettingsComponent], function (_component) {
        component = _component;
        component.userSettingsModal = {
            nativeElement: {}
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
    testing_1.it('selectedUser should be null', function () {
        chai_1.expect(component.selectedUser).to.be.null;
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
        testing_1.it('selectedUser should be null', function () {
            chai_1.expect(component.selectedUser).to.be.null;
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                getUsersDetailsSpy.reset();
                component.reload();
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
            testing_1.it('selectedUser should be null', function () {
                chai_1.expect(component.selectedUser).to.be.null;
            });
        });
    });
    testing_1.describe('getting users details succeeds', function () {
        var usersDetails;
        testing_1.beforeEach(function () {
            usersDetails =
                _.map([1, 2, 3], function (_id) {
                    return { id: _id, username: _id.toString() };
                });
            getUsersDetailsResult.next(usersDetails);
            getUsersDetailsResult.complete();
        });
        testing_1.it('isLoadingUsers should be false', function () {
            chai_1.expect(component.isLoadingUsers).to.be.false;
        });
        testing_1.it('loadingUsersError should be null', function () {
            chai_1.expect(component.loadingUsersError).to.be.null;
        });
        testing_1.it('usersDetails should be correct', function () {
            chai_1.expect(component.usersDetails).to.deep.equal(usersDetails);
        });
        testing_1.it('selectedUser should be null', function () {
            chai_1.expect(component.selectedUser).to.be.null;
        });
        testing_1.describe('selectUser', function () {
            var userToSelect;
            var jquerySpy;
            var openModalSpy;
            testing_1.beforeEach(function () {
                userToSelect = usersDetails[1];
                var jqueryResult = {
                    openModal: function () { return null; }
                };
                openModalSpy = sinon_1.spy(jqueryResult, 'openModal');
                jquerySpy = sinon_1.stub(window, '$', function () { return jqueryResult; });
                component.selectUser(userToSelect);
            });
            testing_1.afterEach(function () {
                jquerySpy.restore();
            });
            testing_1.it('should update the selctedUser correctly', function () {
                chai_1.expect(component.selectedUser).to.be.equal(userToSelect);
            });
            testing_1.it('should open the modal', function () {
                chai_1.expect(jquerySpy.callCount).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0].length).to.be.equal(1);
                chai_1.expect(jquerySpy.args[0][0]).to.be.equal(component.userSettingsModal.nativeElement);
                chai_1.expect(openModalSpy.callCount).to.be.equal(1);
                chai_1.expect(openModalSpy.args[0]).to.be.length(1);
                chai_1.expect(openModalSpy.args[0][0].complete).to.exist;
            });
            testing_1.describe('reload', function () {
                testing_1.beforeEach(function () {
                    component.reload();
                });
                testing_1.it('should set selectedUser to null', function () {
                    chai_1.expect(component.selectedUser).to.be.null;
                });
            });
            testing_1.describe('close the modal', function () {
                testing_1.beforeEach(function () {
                    openModalSpy.args[0][0].complete();
                });
                testing_1.it('should call zone.run()', function () {
                    chai_1.expect(zoneRunSpy.callCount).to.be.equal(1);
                });
            });
        });
    });
});
//# sourceMappingURL=usersSettings.component.test.js.map