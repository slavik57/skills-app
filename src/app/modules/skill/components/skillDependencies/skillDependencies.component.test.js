"use strict";
var skillDependencies_component_1 = require("./skillDependencies.component");
var testing_1 = require('@angular/core/testing');
var chai_1 = require('chai');
testing_1.describe('SkillDependenciesComponent', function () {
    var skillDetails;
    var component;
    testing_1.beforeEachProviders(function () {
        return [
            skillDependencies_component_1.SkillDependenciesComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillDependencies_component_1.SkillDependenciesComponent], function (_component) {
        component = _component;
        skillDetails = {
            id: 12334,
            skillName: 'some skill name'
        };
        component.skillDetails = skillDetails;
        component.ngOnInit();
    }));
    testing_1.it('SkillDependenciesState should be initialized correctly', function () {
        chai_1.expect(component.SkillDependenciesState).to.be.equal(skillDependencies_component_1.SkillDependenciesState);
    });
    testing_1.it('state should be correct', function () {
        chai_1.expect(component.state).to.be.equal(skillDependencies_component_1.SkillDependenciesState.LIST_DEPENDENCIES);
    });
    testing_1.describe('addDependency', function () {
        testing_1.beforeEach(function () {
            component.addDependency();
        });
        testing_1.it('should set state correctly', function () {
            chai_1.expect(component.state).to.be.equal(skillDependencies_component_1.SkillDependenciesState.ADD_DEPENDENCY);
        });
        testing_1.describe('cancelAddingDependency', function () {
            testing_1.beforeEach(function () {
                component.cancelAddingDependency();
            });
            testing_1.it('should set state correctly', function () {
                chai_1.expect(component.state).to.be.equal(skillDependencies_component_1.SkillDependenciesState.LIST_DEPENDENCIES);
            });
        });
    });
});
//# sourceMappingURL=skillDependencies.component.test.js.map