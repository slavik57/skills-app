"use strict";
var TeamServiceMockFactory = (function () {
    function TeamServiceMockFactory() {
    }
    TeamServiceMockFactory.createTeamServiceMock = function () {
        return {
            getTeamsDetails: function () { return null; },
            isTeamExists: function () { return null; },
            createTeam: function () { return null; },
            deleteTeam: function () { return null; },
            updateTeamName: function () { return null; },
            getTeamMembers: function () { return null; },
            addTeamMember: function () { return null; },
            removeTeamMember: function () { return null; },
            changeTeamAdminRights: function () { return null; }
        };
    };
    return TeamServiceMockFactory;
}());
exports.TeamServiceMockFactory = TeamServiceMockFactory;
//# sourceMappingURL=teamServiceMockFactory.js.map