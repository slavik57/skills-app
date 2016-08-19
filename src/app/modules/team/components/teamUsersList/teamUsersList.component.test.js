"use strict";
var teamUsersList_component_1 = require("./teamUsersList.component");
var teamServiceMockFactory_1 = require("../../../../testUtils/mockFactories/teamServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var teamService_1 = require("../../../common/services/teamService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var _ = require('lodash');
testing_1.describe('TeamUsersListComponent', function () {
    var teamServiceMock;
    var getTeamMembersSpy;
    var getTeamMembersResult;
    var teamDetails;
    var teamMembersChangedRaises;
    var removingTeamMemberStateChangedRaises;
    var component;
    testing_1.beforeEachProviders(function () {
        teamServiceMock = teamServiceMockFactory_1.TeamServiceMockFactory.createTeamServiceMock();
        getTeamMembersSpy =
            sinon_1.stub(teamServiceMock, 'getTeamMembers', function () {
                getTeamMembersResult = new Subject_1.Subject();
                return getTeamMembersResult;
            });
        return [
            core_1.provide(teamService_1.TeamService, { useValue: teamServiceMock }),
            teamUsersList_component_1.TeamUsersListComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([teamUsersList_component_1.TeamUsersListComponent], function (_component) {
        component = _component;
        teamDetails = {
            id: 12321,
            teamName: 'some team name'
        };
        component.teamDetails = teamDetails;
        teamMembersChangedRaises = [];
        component.teamMembersChangedEvent.subscribe(function (_teamMembers) {
            teamMembersChangedRaises.push(_teamMembers);
        });
        removingTeamMemberStateChangedRaises = [];
        component.removingTeamMemberStateChangedEvent.subscribe(function (_isRemoving) {
            removingTeamMemberStateChangedRaises.push(_isRemoving);
        });
        component.ngOnInit();
    }));
    testing_1.it('isLoadingTeamMembers should be true', function () {
        chai_1.expect(component.isLoadingTeamMembers).to.be.true;
    });
    testing_1.it('loadingTeamMembersError should be null', function () {
        chai_1.expect(component.loadingTeamMembersError).to.be.null;
    });
    testing_1.it('should call tamService.getTeamMembers()', function () {
        chai_1.expect(getTeamMembersSpy.callCount).to.be.equal(1);
        chai_1.expect(getTeamMembersSpy.args[0]).to.be.deep.equal([teamDetails.id]);
    });
    testing_1.it('teamMembers should be null', function () {
        chai_1.expect(component.teamMembers).to.be.null;
    });
    testing_1.it('teamMembersChanged should exist', function () {
        chai_1.expect(component.teamMembersChangedEvent).to.exist;
    });
    testing_1.it('teamMembersChanged should not be raised', function () {
        chai_1.expect(teamMembersChangedRaises).to.deep.equal([]);
    });
    testing_1.it('should set as not removing team member', function () {
        chai_1.expect(component.removingTeamMember).to.be.false;
    });
    testing_1.it('removingTeamMemberError should be null', function () {
        chai_1.expect(component.removingTeamMemberError).to.be.null;
    });
    testing_1.describe('getting team members fails', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getTeamMembersResult.error(error);
        });
        testing_1.it('isLoadingTeamMembers should be false', function () {
            chai_1.expect(component.isLoadingTeamMembers).to.be.false;
        });
        testing_1.it('loadingTeamMembersError should be correct', function () {
            chai_1.expect(component.loadingTeamMembersError).to.be.equal(error);
        });
        testing_1.it('teamMembers should be null', function () {
            chai_1.expect(component.teamMembers).to.be.null;
        });
        testing_1.it('teamMembersChangedRaises should not be raised', function () {
            chai_1.expect(teamMembersChangedRaises).to.deep.equal([]);
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                getTeamMembersSpy.reset();
                component.reload();
            });
            testing_1.it('isLoadingTeamMembers should be true', function () {
                chai_1.expect(component.isLoadingTeamMembers).to.be.true;
            });
            testing_1.it('loadingTeamMembersError should be null', function () {
                chai_1.expect(component.loadingTeamMembersError).to.be.null;
            });
            testing_1.it('should call teamService.getTeamMembers()', function () {
                chai_1.expect(getTeamMembersSpy.callCount).to.be.equal(1);
                chai_1.expect(getTeamMembersSpy.args[0]).to.be.deep.equal([teamDetails.id]);
            });
            testing_1.it('teamMembers should be null', function () {
                chai_1.expect(component.teamMembers).to.be.null;
            });
            testing_1.it('teamMembersChangedRaises should not be raised', function () {
                chai_1.expect(teamMembersChangedRaises).to.deep.equal([]);
            });
        });
    });
    testing_1.describe('getting team members succeeds', function () {
        var teamMembers;
        testing_1.beforeEach(function () {
            teamMembers = [
                { id: 0, username: 'a', isAdmin: true },
                { id: 1, username: 'b', isAdmin: false },
                { id: 2, username: 'c', isAdmin: true },
            ];
            getTeamMembersResult.next(teamMembers);
            getTeamMembersResult.complete();
        });
        testing_1.it('isLoadingTeamMembers should be false', function () {
            chai_1.expect(component.isLoadingTeamMembers).to.be.false;
        });
        testing_1.it('loadingTeamMembersError should be null', function () {
            chai_1.expect(component.loadingTeamMembersError).to.be.null;
        });
        testing_1.it('teamMembers should be correct', function () {
            chai_1.expect(component.teamMembers).to.deep.equal(teamMembers);
        });
        testing_1.it('teamMembersChangedRaises should be raised correctly', function () {
            chai_1.expect(teamMembersChangedRaises).to.deep.equal([teamMembers]);
        });
        testing_1.describe('removeTeamMember', function () {
            var userToRemove;
            var removeTeamMemberSpy;
            var removeTeamMemberResult;
            testing_1.beforeEach(function () {
                userToRemove = teamMembers[1];
                removeTeamMemberSpy = sinon_1.stub(teamServiceMock, 'removeTeamMember', function () {
                    removeTeamMemberResult = new Subject_1.Subject();
                    return removeTeamMemberResult;
                });
                component.removeTeamMember(userToRemove);
            });
            testing_1.it('should set removing team member', function () {
                chai_1.expect(component.removingTeamMember).to.be.true;
            });
            testing_1.it('should call teamService.removeTeamMember', function () {
                chai_1.expect(removeTeamMemberSpy.callCount).to.be.equal(1);
                chai_1.expect(removeTeamMemberSpy.args[0]).to.deep.equal([teamDetails.id, userToRemove.id]);
            });
            testing_1.it('removingTeamMemberError should be null', function () {
                chai_1.expect(component.removingTeamMemberError).to.be.null;
            });
            testing_1.it('should raise removing team member event correctly', function () {
                chai_1.expect(removingTeamMemberStateChangedRaises).to.deep.equal([true]);
            });
            testing_1.describe('removing fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'some error';
                    removingTeamMemberStateChangedRaises = [];
                    removeTeamMemberResult.error(error);
                });
                testing_1.it('should set as not removing team member', function () {
                    chai_1.expect(component.removingTeamMember).to.be.false;
                });
                testing_1.it('should not remove the user from team members list', function () {
                    var teamMemberIds = _.map(component.teamMembers, function (_) { return _.id; });
                    chai_1.expect(teamMemberIds).to.contain(userToRemove.id);
                });
                testing_1.it('should set removingTeamMemberError correctly', function () {
                    chai_1.expect(component.removingTeamMemberError).to.be.equal(error);
                });
                testing_1.it('should raise removing team member event correctly', function () {
                    chai_1.expect(removingTeamMemberStateChangedRaises).to.deep.equal([false]);
                });
                testing_1.describe('remove another team member', function () {
                    var otherUserToRemove;
                    testing_1.beforeEach(function () {
                        otherUserToRemove = teamMembers[0];
                        removingTeamMemberStateChangedRaises = [];
                        removeTeamMemberSpy.reset();
                        component.removeTeamMember(otherUserToRemove);
                    });
                    testing_1.it('should set removing team member', function () {
                        chai_1.expect(component.removingTeamMember).to.be.true;
                    });
                    testing_1.it('should call teamService.removeTeamMember', function () {
                        chai_1.expect(removeTeamMemberSpy.callCount).to.be.equal(1);
                        chai_1.expect(removeTeamMemberSpy.args[0]).to.deep.equal([teamDetails.id, otherUserToRemove.id]);
                    });
                    testing_1.it('removingTeamMemberError should be null', function () {
                        chai_1.expect(component.removingTeamMemberError).to.be.null;
                    });
                    testing_1.it('should raise removing team member event correctly', function () {
                        chai_1.expect(removingTeamMemberStateChangedRaises).to.deep.equal([true]);
                    });
                });
            });
            testing_1.describe('removing succeeds', function () {
                testing_1.beforeEach(function () {
                    removingTeamMemberStateChangedRaises = [];
                    teamMembersChangedRaises = [];
                    removeTeamMemberResult.next(null);
                    removeTeamMemberResult.complete();
                });
                testing_1.it('should set as not removing team member', function () {
                    chai_1.expect(component.removingTeamMember).to.be.false;
                });
                testing_1.it('should remove the user from team members list', function () {
                    var teamMemberIds = _.map(component.teamMembers, function (_) { return _.id; });
                    chai_1.expect(teamMemberIds).to.not.contain(userToRemove.id);
                });
                testing_1.it('should raise removing team member event correctly', function () {
                    chai_1.expect(removingTeamMemberStateChangedRaises).to.deep.equal([false]);
                });
                testing_1.it('should raise team members changed correctly', function () {
                    chai_1.expect(teamMembersChangedRaises).to.deep.equal([component.teamMembers]);
                });
            });
        });
    });
});
//# sourceMappingURL=teamUsersList.component.test.js.map