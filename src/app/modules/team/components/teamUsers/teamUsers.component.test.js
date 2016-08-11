"use strict";
var teamUsers_component_1 = require("./teamUsers.component");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
testing_1.describe('TeamUsersComponent', function () {
    var teamDetails;
    var component;
    testing_1.beforeEachProviders(function () {
        return [
            teamUsers_component_1.TeamUsersComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([teamUsers_component_1.TeamUsersComponent], function (_component) {
        component = _component;
        teamDetails = {
            id: 12334,
            teamName: 'some team name'
        };
        component.teamDetails = teamDetails;
        component.ngOnInit();
    }));
    testing_1.it('TeamUsersState should be initialized correctly', function () {
        chai_1.expect(component.TeamUsersState).to.be.equal(teamUsers_component_1.TeamUsersState);
    });
    testing_1.it('state should be correct', function () {
        chai_1.expect(component.state).to.be.equal(teamUsers_component_1.TeamUsersState.LIST_USERS);
    });
    testing_1.describe('addTeamMember', function () {
        testing_1.beforeEach(function () {
            component.addTeamMember();
        });
        testing_1.it('should set state correctly', function () {
            chai_1.expect(component.state).to.be.equal(teamUsers_component_1.TeamUsersState.ADD_TEAM_MEMBER);
        });
        testing_1.describe('cancelAddingTeamMember', function () {
            testing_1.beforeEach(function () {
                component.cancelAddingTeamMember();
            });
            testing_1.it('should set state correctly', function () {
                chai_1.expect(component.state).to.be.equal(teamUsers_component_1.TeamUsersState.LIST_USERS);
            });
        });
    });
});
//# sourceMappingURL=teamUsers.component.test.js.map