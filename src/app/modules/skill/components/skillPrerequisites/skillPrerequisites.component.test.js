"use strict";
var skillPrerequisites_component_1 = require("./skillPrerequisites.component");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
testing_1.describe('SkillPrerequisitesComponent', function () {
    var skillDetails;
    var component;
    testing_1.beforeEachProviders(function () {
        return [
            skillPrerequisites_component_1.SkillPrerequisitesComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillPrerequisites_component_1.SkillPrerequisitesComponent], function (_component) {
        component = _component;
        skillDetails = {
            id: 12334,
            skillName: 'some skill name'
        };
        component.skillDetails = skillDetails;
        component.ngOnInit();
    }));
    testing_1.it('SkillPrerequisitesState should be initialized correctly', function () {
        chai_1.expect(component.SkillPrerequisitesState).to.be.equal(skillPrerequisites_component_1.SkillPrerequisitesState);
    });
    testing_1.it('state should be correct', function () {
        chai_1.expect(component.state).to.be.equal(skillPrerequisites_component_1.SkillPrerequisitesState.LIST_PREREQUISITES);
    });
    testing_1.describe('addPrerequisite', function () {
        testing_1.beforeEach(function () {
            component.addPrerequisite();
        });
        testing_1.it('should set state correctly', function () {
            chai_1.expect(component.state).to.be.equal(skillPrerequisites_component_1.SkillPrerequisitesState.ADD_PREREQUISITE);
        });
        testing_1.describe('cancelAddingPrerequisite', function () {
            testing_1.beforeEach(function () {
                component.cancelAddingPrerequisite();
            });
            testing_1.it('should set state correctly', function () {
                chai_1.expect(component.state).to.be.equal(skillPrerequisites_component_1.SkillPrerequisitesState.LIST_PREREQUISITES);
            });
        });
    });
});
//# sourceMappingURL=skillPrerequisites.component.test.js.map