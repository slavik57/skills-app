"use strict";
var skillDependenciesList_component_1 = require("./skillDependenciesList.component");
var skillServiceMockFactory_1 = require("../../../../testUtils/mockFactories/skillServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var skillService_1 = require("../../../common/services/skillService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var _ = require('lodash');
testing_1.describe('SkillDependenciesListComponent', function () {
    var skillServiceMock;
    var getSkillDependenciesSpy;
    var getSkillDependenciesResult;
    var skillDetails;
    var skillDependenciesChangedRaises;
    var changingSkillDependencyRaises;
    var component;
    testing_1.beforeEachProviders(function () {
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        getSkillDependenciesSpy =
            sinon_1.stub(skillServiceMock, 'getSkillDependencies', function () {
                getSkillDependenciesResult = new Subject_1.Subject();
                return getSkillDependenciesResult;
            });
        return [
            core_1.provide(skillService_1.SkillService, { useValue: skillServiceMock }),
            skillDependenciesList_component_1.SkillDependenciesListComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillDependenciesList_component_1.SkillDependenciesListComponent], function (_component) {
        component = _component;
        skillDetails = {
            id: 12321,
            skillName: 'some skill name'
        };
        component.skillDetails = skillDetails;
        skillDependenciesChangedRaises = [];
        component.skillDependenciesChangedEvent.subscribe(function (_skillDependencies) {
            skillDependenciesChangedRaises.push(_skillDependencies);
        });
        changingSkillDependencyRaises = [];
        component.changingSkillDependenciesEvent.subscribe(function (_isRemoving) {
            changingSkillDependencyRaises.push(_isRemoving);
        });
        component.ngOnInit();
    }));
    testing_1.it('isLoadingSkillDependencies should be true', function () {
        chai_1.expect(component.isLoadingSkillDependencies).to.be.true;
    });
    testing_1.it('loadingSkillDependenciesError should be null', function () {
        chai_1.expect(component.loadingSkillDependenciesError).to.be.null;
    });
    testing_1.it('should call skillService.getSkillDependencies()', function () {
        chai_1.expect(getSkillDependenciesSpy.callCount).to.be.equal(1);
        chai_1.expect(getSkillDependenciesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
    });
    testing_1.it('skillDependencies should be null', function () {
        chai_1.expect(component.skillDependencies).to.be.null;
    });
    testing_1.it('skillDependenciesChangedEvent should exist', function () {
        chai_1.expect(component.skillDependenciesChangedEvent).to.exist;
    });
    testing_1.it('skillDependenciesChanged should not be raised', function () {
        chai_1.expect(skillDependenciesChangedRaises).to.deep.equal([]);
    });
    testing_1.it('should set as not updating skill dependency', function () {
        chai_1.expect(component.updatingSkillDependency).to.be.false;
    });
    testing_1.it('updatingSkillDependencyError should be null', function () {
        chai_1.expect(component.updatingSkillDependencyError).to.be.null;
    });
    testing_1.describe('getting skill dependencies fails', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getSkillDependenciesResult.error(error);
        });
        testing_1.it('isLoadingSkillDependencies should be false', function () {
            chai_1.expect(component.isLoadingSkillDependencies).to.be.false;
        });
        testing_1.it('loadingSkillDependenciesError should be correct', function () {
            chai_1.expect(component.loadingSkillDependenciesError).to.be.equal(error);
        });
        testing_1.it('skillDependencies should be null', function () {
            chai_1.expect(component.skillDependencies).to.be.null;
        });
        testing_1.it('skillDependenciesChanged should not be raised', function () {
            chai_1.expect(skillDependenciesChangedRaises).to.deep.equal([]);
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                getSkillDependenciesSpy.reset();
                component.reload();
            });
            testing_1.it('isLoadingSkillDependencies should be true', function () {
                chai_1.expect(component.isLoadingSkillDependencies).to.be.true;
            });
            testing_1.it('loadingSkillDependenciesError should be null', function () {
                chai_1.expect(component.loadingSkillDependenciesError).to.be.null;
            });
            testing_1.it('should call skillService.getSkillDependencies()', function () {
                chai_1.expect(getSkillDependenciesSpy.callCount).to.be.equal(1);
                chai_1.expect(getSkillDependenciesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
            });
            testing_1.it('skillDependencies should be null', function () {
                chai_1.expect(component.skillDependencies).to.be.null;
            });
            testing_1.it('skillDependenciesChanged should not be raised', function () {
                chai_1.expect(skillDependenciesChangedRaises).to.deep.equal([]);
            });
        });
    });
    testing_1.describe('getting skill dependencies succeeds', function () {
        var skillDependencies;
        testing_1.beforeEach(function () {
            skillDependencies = [
                { id: 0, skillName: 'a' },
                { id: 1, skillName: 'b' },
                { id: 2, skillName: 'c' },
            ];
            getSkillDependenciesResult.next(skillDependencies);
            getSkillDependenciesResult.complete();
        });
        testing_1.it('isLoadingSkillDependencies should be false', function () {
            chai_1.expect(component.isLoadingSkillDependencies).to.be.false;
        });
        testing_1.it('loadingSkillDependenciesError should be null', function () {
            chai_1.expect(component.loadingSkillDependenciesError).to.be.null;
        });
        testing_1.it('skillDependencies should be correct', function () {
            chai_1.expect(component.skillDependencies).to.deep.equal(skillDependencies);
        });
        testing_1.it('skillDependenciesChanged should be raised correctly', function () {
            chai_1.expect(skillDependenciesChangedRaises).to.deep.equal([skillDependencies]);
        });
        testing_1.describe('removeSkillDependency', function () {
            var skillDependencyToRemove;
            var removeSkillDependencySpy;
            var removeSkillDependencyResult;
            testing_1.beforeEach(function () {
                skillDependencyToRemove = skillDependencies[1];
                removeSkillDependencySpy = sinon_1.stub(skillServiceMock, 'removeSkillDependency', function () {
                    removeSkillDependencyResult = new Subject_1.Subject();
                    return removeSkillDependencyResult;
                });
                component.removeSkillDependency(skillDependencyToRemove);
            });
            testing_1.it('should set updating skill dependency', function () {
                chai_1.expect(component.updatingSkillDependency).to.be.true;
            });
            testing_1.it('should call skillService.removeSkillDependency', function () {
                chai_1.expect(removeSkillDependencySpy.callCount).to.be.equal(1);
                chai_1.expect(removeSkillDependencySpy.args[0]).to.deep.equal([skillDetails.id, skillDependencyToRemove.id]);
            });
            testing_1.it('updatingSkillDependencyError should be null', function () {
                chai_1.expect(component.updatingSkillDependencyError).to.be.null;
            });
            testing_1.it('should raise changing skill dependency event correctly', function () {
                chai_1.expect(changingSkillDependencyRaises).to.deep.equal([true]);
            });
            testing_1.describe('removing fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'some error';
                    changingSkillDependencyRaises = [];
                    removeSkillDependencyResult.error(error);
                });
                testing_1.it('should set as not updating skill dependency', function () {
                    chai_1.expect(component.updatingSkillDependency).to.be.false;
                });
                testing_1.it('should not remove the dependency from skill dependencies list', function () {
                    var skillDependenciesIds = _.map(component.skillDependencies, function (_) { return _.id; });
                    chai_1.expect(skillDependenciesIds).to.contain(skillDependencyToRemove.id);
                });
                testing_1.it('should set updatingSkillDependencyError correctly', function () {
                    chai_1.expect(component.updatingSkillDependencyError).to.be.equal(error);
                });
                testing_1.it('should raise changing skill dependency event correctly', function () {
                    chai_1.expect(changingSkillDependencyRaises).to.deep.equal([false]);
                });
                testing_1.describe('remove another skill dependency', function () {
                    var otherSkillDependencyToRemove;
                    testing_1.beforeEach(function () {
                        otherSkillDependencyToRemove = skillDependencies[0];
                        changingSkillDependencyRaises = [];
                        removeSkillDependencySpy.reset();
                        component.removeSkillDependency(otherSkillDependencyToRemove);
                    });
                    testing_1.it('should set updating skill dependencies', function () {
                        chai_1.expect(component.updatingSkillDependency).to.be.true;
                    });
                    testing_1.it('should call skillService.removeSkillDependency', function () {
                        chai_1.expect(removeSkillDependencySpy.callCount).to.be.equal(1);
                        chai_1.expect(removeSkillDependencySpy.args[0]).to.deep.equal([skillDetails.id, otherSkillDependencyToRemove.id]);
                    });
                    testing_1.it('updatingSkillDependencyError should be null', function () {
                        chai_1.expect(component.updatingSkillDependencyError).to.be.null;
                    });
                    testing_1.it('should raise changing skill dependency event correctly', function () {
                        chai_1.expect(changingSkillDependencyRaises).to.deep.equal([true]);
                    });
                });
            });
            testing_1.describe('removing succeeds', function () {
                testing_1.beforeEach(function () {
                    changingSkillDependencyRaises = [];
                    skillDependenciesChangedRaises = [];
                    removeSkillDependencyResult.next(null);
                    removeSkillDependencyResult.complete();
                });
                testing_1.it('should set as not updating skill dependency', function () {
                    chai_1.expect(component.updatingSkillDependency).to.be.false;
                });
                testing_1.it('should remove the skill dependency from skill dependencies list', function () {
                    var skilDependenciesIds = _.map(component.skillDependencies, function (_) { return _.id; });
                    chai_1.expect(skilDependenciesIds).to.not.contain(skillDependencyToRemove.id);
                });
                testing_1.it('should raise changing skill dependency event correctly', function () {
                    chai_1.expect(changingSkillDependencyRaises).to.deep.equal([false]);
                });
                testing_1.it('should raise skill dependencies changed correctly', function () {
                    chai_1.expect(skillDependenciesChangedRaises).to.deep.equal([component.skillDependencies]);
                });
            });
        });
    });
});
//# sourceMappingURL=skillDependenciesList.component.test.js.map