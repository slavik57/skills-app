"use strict";
var userServiceMockFactory_1 = require("../../../../testUtils/mockFactories/userServiceMockFactory");
var teamServiceMockFactory_1 = require("../../../../testUtils/mockFactories/teamServiceMockFactory");
var formFiller_1 = require("../../../../testUtils/formFiller");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var teamService_1 = require("../../../common/services/teamService");
var userService_1 = require("../../../common/services/userService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var addTeamUser_component_1 = require("./addTeamUser.component");
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var usernameNotExistsValidator_1 = require("../../../common/validators/usernameNotExistsValidator");
testing_1.describe('TeamUsersComponent', function () {
    var teamDetails;
    var userServiceMock;
    var teamServiceMock;
    var component;
    var getUsersDetailsByPartialUsernameSpy;
    var getUsersDetailsByPartialUsernameResult;
    var usernameNotExistsResult;
    var usernameNotExistsValidatorMock;
    var usernameNotExistsValidatorFactoryMock;
    var usernameNotExistsValidatorBindControlSpy;
    var createUsernameNotExistsValidatorSpy;
    var destroyUsernameNotExistsValidatorSpy;
    testing_1.beforeEachProviders(function () {
        userServiceMock = userServiceMockFactory_1.UserServiceMockFactory.createUserServiceMock();
        teamServiceMock = teamServiceMockFactory_1.TeamServiceMockFactory.createTeamServiceMock();
        getUsersDetailsByPartialUsernameSpy =
            sinon_1.stub(userServiceMock, 'getUsersDetailsByPartialUsername', function () {
                getUsersDetailsByPartialUsernameResult = new Subject_1.Subject();
                return getUsersDetailsByPartialUsernameResult;
            });
        usernameNotExistsValidatorMock = {
            bindControl: function () { },
            isExists: function () {
                usernameNotExistsResult = new Subject_1.Subject();
                return usernameNotExistsResult;
            },
            destroy: function () { return null; }
        };
        usernameNotExistsValidatorBindControlSpy =
            sinon_1.spy(usernameNotExistsValidatorMock, 'bindControl');
        usernameNotExistsValidatorFactoryMock = {
            create: function () { return usernameNotExistsValidatorMock; },
        };
        createUsernameNotExistsValidatorSpy =
            sinon_1.spy(usernameNotExistsValidatorFactoryMock, 'create');
        destroyUsernameNotExistsValidatorSpy =
            sinon_1.spy(usernameNotExistsValidatorMock, 'destroy');
        return [
            forms_1.FormBuilder,
            core_1.provide(teamService_1.TeamService, { useValue: teamServiceMock }),
            core_1.provide(userService_1.UserService, { useValue: userServiceMock }),
            core_1.provide(usernameNotExistsValidator_1.UsernameNotExistsValidatorFactory, { useValue: usernameNotExistsValidatorFactoryMock }),
            addTeamUser_component_1.AddTeamUserComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([addTeamUser_component_1.AddTeamUserComponent], function (_component) {
        component = _component;
        teamDetails = {
            id: 12334,
            teamName: 'some team name'
        };
        component.teamDetails = teamDetails;
    }));
    testing_1.describe('initialize', function () {
        testing_1.beforeEach(function () {
            component.ngOnInit();
        });
        testing_1.describe('usersByPartialUsernameSource.getItems', function () {
            var partialUsername;
            var actualUsers;
            var actualError;
            testing_1.beforeEach(function () {
                partialUsername = 'partialUsername';
                component.usersByPartialUsernameSource.getItems(partialUsername)
                    .subscribe(function (_users) {
                    actualUsers = _users;
                }, function (_error) {
                    actualError = _error;
                });
            });
            testing_1.it('should call teamService.getUsersByPartialUsername', function () {
                chai_1.expect(getUsersDetailsByPartialUsernameSpy.callCount).to.be.equal(1);
                chai_1.expect(getUsersDetailsByPartialUsernameSpy.args[0]).to.deep.equal([partialUsername, addTeamUser_component_1.AddTeamUserComponent.MAX_NUMBER_OF_SUGGESTED_USERS]);
            });
            testing_1.describe('service fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'some error';
                    getUsersDetailsByPartialUsernameResult.error(error);
                });
                testing_1.it('should fail correctly', function () {
                    chai_1.expect(actualError).to.be.equal(error);
                });
            });
            testing_1.describe('service succeeds', function () {
                var users;
                testing_1.beforeEach(function () {
                    users = [
                        {
                            id: 1,
                            username: 'username1'
                        },
                        {
                            id: 2,
                            username: 'username2'
                        }];
                    getUsersDetailsByPartialUsernameResult.next(users);
                    getUsersDetailsByPartialUsernameResult.complete();
                });
                testing_1.it('should return correct result', function () {
                    chai_1.expect(actualUsers).to.be.equal(users);
                });
            });
        });
        testing_1.it('usersByPartialUsernameSource.convertItemToString should return the username', function () {
            var username = 'some username1';
            var userDetails = {
                id: 123,
                username: username
            };
            chai_1.expect(component.usersByPartialUsernameSource.converItemToString(userDetails)).to.be.equal(username);
        });
        testing_1.it('when the component is destroyed should destroy the TeamExistsValidator', function () {
            component.ngOnDestroy();
            chai_1.expect(destroyUsernameNotExistsValidatorSpy.callCount).to.be.equal(1);
        });
        testing_1.it('addTeamUserError should be correct', function () {
            chai_1.expect(component.addTeamUserError).to.be.undefined;
        });
        testing_1.it('isAddingTeamUser should be correct', function () {
            chai_1.expect(component.isAddingTeamUser).to.be.false;
        });
        testing_1.it('should initialize the addTeamUserFormGroup', function () {
            chai_1.expect(component.addTeamUserFormGroup).to.exist;
        });
        testing_1.it('canAddUserToTeam should return false', function () {
            chai_1.expect(component.canAddUserToTeam()).to.be.false;
        });
        testing_1.describe('usernameControl', function () {
            testing_1.it('value should be correct', function () {
                chai_1.expect(component.usernameControl.value).to.be.equal('');
            });
            testing_1.it('should initialize the UsernameNotExistsValidator correctly', function () {
                chai_1.expect(createUsernameNotExistsValidatorSpy.callCount).to.be.equal(1);
            });
            testing_1.it('should bind the UsernameNotExistsValidator to usernameControl', function () {
                chai_1.expect(usernameNotExistsValidatorBindControlSpy.callCount).to.be.equal(1);
                chai_1.expect(usernameNotExistsValidatorBindControlSpy.args[0][0]).to.be.equal(component.usernameControl);
            });
            testing_1.describe('change the username', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(component.usernameControl.errors).to.exist;
                    });
                    testing_1.it('canAddUserToTeam should return false', function () {
                        chai_1.expect(component.canAddUserToTeam()).to.be.false;
                    });
                });
                testing_1.describe('to some username', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some username';
                        formFiller_1.FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);
                        usernameNotExistsResult.next(null);
                        usernameNotExistsResult.complete();
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(component.usernameControl.errors).to.not.exist;
                    });
                    testing_1.it('canAddUserToTeam should return true', function () {
                        chai_1.expect(component.canAddUserToTeam()).to.be.true;
                    });
                    testing_1.describe('clear username', function () {
                        testing_1.beforeEach(function () {
                            var value = '';
                            formFiller_1.FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(component.usernameControl.errors).to.exist;
                        });
                        testing_1.it('canAddUserToTeam should return false', function () {
                            chai_1.expect(component.canAddUserToTeam()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to not existing username', function () {
                    testing_1.beforeEach(function () {
                        var value = 'existing team name';
                        formFiller_1.FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, value);
                        usernameNotExistsResult.next({ 'someError': true });
                        usernameNotExistsResult.complete();
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(component.usernameControl.errors).to.exist;
                    });
                    testing_1.it('canAddUserToTeam should return false', function () {
                        chai_1.expect(component.canAddUserToTeam()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('addTeamUser()', function () {
            var username;
            var addTeamMemberResult;
            var addTeamMemberStub;
            var emittedTeamMembers;
            testing_1.beforeEach(function () {
                username = 'some username';
                formFiller_1.FormFiller.fillFormControl(component.addTeamUserFormGroup, component.usernameControl, username);
                usernameNotExistsResult.next(null);
                usernameNotExistsResult.complete();
                addTeamMemberStub =
                    sinon_1.stub(teamServiceMock, 'addTeamMember', function () {
                        addTeamMemberResult = new Subject_1.Subject();
                        return addTeamMemberResult;
                    });
                emittedTeamMembers = [];
                component.teamMemberAddedEvent.subscribe(function (_teamMember) {
                    emittedTeamMembers.push(_teamMember);
                });
                component.addTeamUser();
            });
            testing_1.afterEach(function () {
                addTeamMemberStub.restore();
            });
            testing_1.it('should call teamService.addTeamMember() correctly', function () {
                chai_1.expect(addTeamMemberStub.callCount).to.be.equal(1);
                chai_1.expect(addTeamMemberStub.args[0]).to.be.deep.equal([teamDetails.id, username]);
            });
            testing_1.it('should set isAddingTeamUser to true', function () {
                chai_1.expect(component.isAddingTeamUser).to.be.true;
            });
            testing_1.it('should set addTeamUserError to null', function () {
                chai_1.expect(component.addTeamUserError).to.be.null;
            });
            testing_1.it('teamMemberAddedEvent should not be emitted', function () {
                chai_1.expect(emittedTeamMembers).to.deep.equal([]);
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'create team error';
                    addTeamMemberResult.error(error);
                });
                testing_1.it('should set isAddingTeamUser to false', function () {
                    chai_1.expect(component.isAddingTeamUser).to.be.false;
                });
                testing_1.it('should set addTeamUserError correctly', function () {
                    chai_1.expect(component.addTeamUserError).to.be.equal(error);
                });
                testing_1.it('teamMemberAddedEvent should not be emitted', function () {
                    chai_1.expect(emittedTeamMembers).to.deep.equal([]);
                });
            });
            testing_1.describe('updating succeeds', function () {
                var addedTeamMember;
                var updateTextFieldsSpy;
                testing_1.beforeEach(testing_1.fakeAsync(function () {
                    addedTeamMember = {
                        id: 12345,
                        username: 'some username',
                        isAdmin: true
                    };
                    updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
                    addTeamMemberResult.next(addedTeamMember);
                    addTeamMemberResult.complete();
                    testing_1.tick(0);
                }));
                testing_1.afterEach(function () {
                    updateTextFieldsSpy.restore();
                });
                testing_1.it('should set isAddingTeamUser to false', function () {
                    chai_1.expect(component.isAddingTeamUser).to.be.false;
                });
                testing_1.it('should set addTeamUserError to null', function () {
                    chai_1.expect(component.addTeamUserError).to.be.null;
                });
                testing_1.it('canAddUserToTeam() should return false', function () {
                    chai_1.expect(component.canAddUserToTeam()).to.be.false;
                });
                testing_1.it('should raise team created event correctly', function () {
                    chai_1.expect(emittedTeamMembers).to.be.deep.equal([addedTeamMember]);
                });
                testing_1.it('should clear the usernameControl', function () {
                    chai_1.expect(component.usernameControl.value).to.be.empty;
                });
                testing_1.it('should set the usernameControl as untouched', function () {
                    chai_1.expect(component.usernameControl.touched).to.be.false;
                });
                testing_1.it('should set the usernameControl as pristine', function () {
                    chai_1.expect(component.usernameControl.pristine).to.be.true;
                });
                testing_1.it('should call Materialize.updateTextFields()', function () {
                    chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
                });
                testing_1.describe('addTeamUser()', function () {
                    testing_1.beforeEach(function () {
                        component.addTeamUser();
                    });
                    testing_1.it('should set isAddingTeamUser to true', function () {
                        chai_1.expect(component.isAddingTeamUser).to.be.true;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=addTeamUser.component.test.js.map