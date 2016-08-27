"use strict";
var SkillServiceMockFactory = (function () {
    function SkillServiceMockFactory() {
    }
    SkillServiceMockFactory.createSkillServiceMock = function () {
        return {
            getSkillsDetails: function () { return null; },
            deleteSkill: function () { return null; },
            createSkill: function () { return null; },
            isSkillExists: function () { return null; },
            getSkillDependencies: function () { return null; },
            removeSkillDependency: function () { return null; },
            addSkillDependency: function () { return null; },
            getSkillsDetailsByPartialSkillName: function () { return null; },
            getSkillPrerequisites: function () { return null; },
            addSkillPrerequisite: function () { return null; },
            removeSkillPrerequisite: function () { return null; }
        };
    };
    return SkillServiceMockFactory;
}());
exports.SkillServiceMockFactory = SkillServiceMockFactory;
//# sourceMappingURL=skillServiceMockFactory.js.map