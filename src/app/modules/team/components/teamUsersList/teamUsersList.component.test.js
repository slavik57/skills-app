"use strict";
var teamUsersList_component_1 = require("./teamUsersList.component");
var teamServiceMockFactory_1 = require("../../../../testUtils/mockFactories/teamServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var teamService_1 = require("../../../common/services/teamService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
testing_1.describe('TeamUsersListComponent', function () {
    var teamServiceMock;
    var getTeamMembersSpy;
    var getTeamMembersResult;
    var teamDetails;
    var teamMembersChangedRaises;
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
        component.teamMembersChanged.subscribe(function (_teamMembers) {
            teamMembersChangedRaises.push(_teamMembers);
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
        chai_1.expect(component.teamMembersChanged).to.exist;
    });
    testing_1.it('teamMembersChanged should not be raised', function () {
        chai_1.expect(teamMembersChangedRaises).to.deep.equal([]);
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
                { id: 0, username: 'a' },
                { id: 1, username: 'b' },
                { id: 2, username: 'c' },
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
    });
});
//# sourceMappingURL=teamUsersList.component.test.js.map