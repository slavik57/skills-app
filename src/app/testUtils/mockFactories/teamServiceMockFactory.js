"use strict";
var TeamServiceMockFactory = (function () {
    function TeamServiceMockFactory() {
    }
    TeamServiceMockFactory.createTeamServiceMock = function () {
        return {
            getTeamsDetails: function () { return null; }
        };
    };
    return TeamServiceMockFactory;
}());
exports.TeamServiceMockFactory = TeamServiceMockFactory;
//# sourceMappingURL=teamServiceMockFactory.js.map