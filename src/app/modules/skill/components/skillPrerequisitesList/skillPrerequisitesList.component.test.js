"use strict";
var skillPrerequisitesList_component_1 = require("./skillPrerequisitesList.component");
var skillServiceMockFactory_1 = require("../../../../testUtils/mockFactories/skillServiceMockFactory");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var chai_1 = require('chai');
var skillService_1 = require("../../../common/services/skillService");
var sinon_1 = require('sinon');
var Subject_1 = require('rxjs/Subject');
var _ = require('lodash');
testing_1.describe('SkillPrerequisitesListComponent', function () {
    var skillServiceMock;
    var getSkillPrerequisitesSpy;
    var getSkillPrerequisitesResult;
    var skillDetails;
    var skillPrerequisitesChangedRaises;
    var changingSkillPrerequisiteRaises;
    var component;
    testing_1.beforeEachProviders(function () {
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        getSkillPrerequisitesSpy =
            sinon_1.stub(skillServiceMock, 'getSkillPrerequisites', function () {
                getSkillPrerequisitesResult = new Subject_1.Subject();
                return getSkillPrerequisitesResult;
            });
        return [
            core_1.provide(skillService_1.SkillService, { useValue: skillServiceMock }),
            skillPrerequisitesList_component_1.SkillPrerequisitesListComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([skillPrerequisitesList_component_1.SkillPrerequisitesListComponent], function (_component) {
        component = _component;
        skillDetails = {
            id: 12321,
            skillName: 'some skill name'
        };
        component.skillDetails = skillDetails;
        skillPrerequisitesChangedRaises = [];
        component.skillPrerequisitesChangedEvent.subscribe(function (_skillPrerequisites) {
            skillPrerequisitesChangedRaises.push(_skillPrerequisites);
        });
        changingSkillPrerequisiteRaises = [];
        component.changingSkillPrerequisitesEvent.subscribe(function (_isRemoving) {
            changingSkillPrerequisiteRaises.push(_isRemoving);
        });
        component.ngOnInit();
    }));
    testing_1.it('isLoadingSkillPrerequisites should be true', function () {
        chai_1.expect(component.isLoadingSkillPrerequisites).to.be.true;
    });
    testing_1.it('loadingSkillPrerequisitesError should be null', function () {
        chai_1.expect(component.loadingSkillPrerequisitesError).to.be.null;
    });
    testing_1.it('should call skillService.getSkillPrerequisites()', function () {
        chai_1.expect(getSkillPrerequisitesSpy.callCount).to.be.equal(1);
        chai_1.expect(getSkillPrerequisitesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
    });
    testing_1.it('skillPrerequisites should be null', function () {
        chai_1.expect(component.skillPrerequisites).to.be.null;
    });
    testing_1.it('skillPrerequisitesChangedEvent should exist', function () {
        chai_1.expect(component.skillPrerequisitesChangedEvent).to.exist;
    });
    testing_1.it('skillPrerequisitesChanged should not be raised', function () {
        chai_1.expect(skillPrerequisitesChangedRaises).to.deep.equal([]);
    });
    testing_1.it('should set as not updating skill prerequisite', function () {
        chai_1.expect(component.updatingSkillPrerequisite).to.be.false;
    });
    testing_1.it('updatingSkillPrerequisiteError should be null', function () {
        chai_1.expect(component.updatingSkillPrerequisiteError).to.be.null;
    });
    testing_1.describe('getting skill prerequisites fails', function () {
        var error;
        testing_1.beforeEach(function () {
            error = 'some error';
            getSkillPrerequisitesResult.error(error);
        });
        testing_1.it('isLoadingSkillPrerequisites should be false', function () {
            chai_1.expect(component.isLoadingSkillPrerequisites).to.be.false;
        });
        testing_1.it('loadingSkillPrerequisitesError should be correct', function () {
            chai_1.expect(component.loadingSkillPrerequisitesError).to.be.equal(error);
        });
        testing_1.it('skillPrerequisites should be null', function () {
            chai_1.expect(component.skillPrerequisites).to.be.null;
        });
        testing_1.it('skillPrerequisitesChanged should not be raised', function () {
            chai_1.expect(skillPrerequisitesChangedRaises).to.deep.equal([]);
        });
        testing_1.describe('reload', function () {
            testing_1.beforeEach(function () {
                getSkillPrerequisitesSpy.reset();
                component.reload();
            });
            testing_1.it('isLoadingSkillPrerequisites should be true', function () {
                chai_1.expect(component.isLoadingSkillPrerequisites).to.be.true;
            });
            testing_1.it('loadingSkilPrerequisitesError should be null', function () {
                chai_1.expect(component.loadingSkillPrerequisitesError).to.be.null;
            });
            testing_1.it('should call skillService.getSkillPrerequisites()', function () {
                chai_1.expect(getSkillPrerequisitesSpy.callCount).to.be.equal(1);
                chai_1.expect(getSkillPrerequisitesSpy.args[0]).to.be.deep.equal([skillDetails.id]);
            });
            testing_1.it('skillPrerequisites should be null', function () {
                chai_1.expect(component.skillPrerequisites).to.be.null;
            });
            testing_1.it('skillPrerequisitesChanged should not be raised', function () {
                chai_1.expect(skillPrerequisitesChangedRaises).to.deep.equal([]);
            });
        });
    });
    testing_1.describe('getting skill prerequisites succeeds', function () {
        var skillPrerequisites;
        testing_1.beforeEach(function () {
            skillPrerequisites = [
                { id: 0, skillName: 'a' },
                { id: 1, skillName: 'b' },
                { id: 2, skillName: 'c' },
            ];
            getSkillPrerequisitesResult.next(skillPrerequisites);
            getSkillPrerequisitesResult.complete();
        });
        testing_1.it('isLoadingSkillPrerequisites should be false', function () {
            chai_1.expect(component.isLoadingSkillPrerequisites).to.be.false;
        });
        testing_1.it('loadingSkillPrerequisitesError should be null', function () {
            chai_1.expect(component.loadingSkillPrerequisitesError).to.be.null;
        });
        testing_1.it('skillPrerequisites should be correct', function () {
            chai_1.expect(component.skillPrerequisites).to.deep.equal(skillPrerequisites);
        });
        testing_1.it('skillPrerequisitesChanged should be raised correctly', function () {
            chai_1.expect(skillPrerequisitesChangedRaises).to.deep.equal([skillPrerequisites]);
        });
        testing_1.describe('removeSkillPrerequisite', function () {
            var skillPrerequisiteToRemove;
            var removeSkillPrerequisiteSpy;
            var removeSkillPrerequisiteResult;
            testing_1.beforeEach(function () {
                skillPrerequisiteToRemove = skillPrerequisites[1];
                removeSkillPrerequisiteSpy = sinon_1.stub(skillServiceMock, 'removeSkillPrerequisite', function () {
                    removeSkillPrerequisiteResult = new Subject_1.Subject();
                    return removeSkillPrerequisiteResult;
                });
                component.removeSkillPrerequisite(skillPrerequisiteToRemove);
            });
            testing_1.it('should set updating skill prerequisite', function () {
                chai_1.expect(component.updatingSkillPrerequisite).to.be.true;
            });
            testing_1.it('should call skillService.removeSkillPrerequisite', function () {
                chai_1.expect(removeSkillPrerequisiteSpy.callCount).to.be.equal(1);
                chai_1.expect(removeSkillPrerequisiteSpy.args[0]).to.deep.equal([skillDetails.id, skillPrerequisiteToRemove.id]);
            });
            testing_1.it('updatingSkillPrerequisiteError should be null', function () {
                chai_1.expect(component.updatingSkillPrerequisiteError).to.be.null;
            });
            testing_1.it('should raise changing skill prerequisite event correctly', function () {
                chai_1.expect(changingSkillPrerequisiteRaises).to.deep.equal([true]);
            });
            testing_1.describe('removing fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'some error';
                    changingSkillPrerequisiteRaises = [];
                    removeSkillPrerequisiteResult.error(error);
                });
                testing_1.it('should set as not updating skill prerequisite', function () {
                    chai_1.expect(component.updatingSkillPrerequisite).to.be.false;
                });
                testing_1.it('should not remove the prerequisite from skill prerequisites list', function () {
                    var skillPrerequisitesIds = _.map(component.skillPrerequisites, function (_) { return _.id; });
                    chai_1.expect(skillPrerequisitesIds).to.contain(skillPrerequisiteToRemove.id);
                });
                testing_1.it('should set updatingSkillPrerequisiteError correctly', function () {
                    chai_1.expect(component.updatingSkillPrerequisiteError).to.be.equal(error);
                });
                testing_1.it('should raise changing skill prerequisite event correctly', function () {
                    chai_1.expect(changingSkillPrerequisiteRaises).to.deep.equal([false]);
                });
                testing_1.describe('remove another skill prerequisite', function () {
                    var otherSkillPrerequisiteToRemove;
                    testing_1.beforeEach(function () {
                        otherSkillPrerequisiteToRemove = skillPrerequisites[0];
                        changingSkillPrerequisiteRaises = [];
                        removeSkillPrerequisiteSpy.reset();
                        component.removeSkillPrerequisite(otherSkillPrerequisiteToRemove);
                    });
                    testing_1.it('should set updating skill prerequisites', function () {
                        chai_1.expect(component.updatingSkillPrerequisite).to.be.true;
                    });
                    testing_1.it('should call skillService.removeSkillPrerequisite', function () {
                        chai_1.expect(removeSkillPrerequisiteSpy.callCount).to.be.equal(1);
                        chai_1.expect(removeSkillPrerequisiteSpy.args[0]).to.deep.equal([skillDetails.id, otherSkillPrerequisiteToRemove.id]);
                    });
                    testing_1.it('updatingSkillPrerequisiteError should be null', function () {
                        chai_1.expect(component.updatingSkillPrerequisiteError).to.be.null;
                    });
                    testing_1.it('should raise changing skill prerequisite event correctly', function () {
                        chai_1.expect(changingSkillPrerequisiteRaises).to.deep.equal([true]);
                    });
                });
            });
            testing_1.describe('removing succeeds', function () {
                testing_1.beforeEach(function () {
                    changingSkillPrerequisiteRaises = [];
                    skillPrerequisitesChangedRaises = [];
                    removeSkillPrerequisiteResult.next(null);
                    removeSkillPrerequisiteResult.complete();
                });
                testing_1.it('should set as not updating skill prerequisite', function () {
                    chai_1.expect(component.updatingSkillPrerequisite).to.be.false;
                });
                testing_1.it('should remove the skill prerequisite from skill prerequisites list', function () {
                    var skilPrerequisitesIds = _.map(component.skillPrerequisites, function (_) { return _.id; });
                    chai_1.expect(skilPrerequisitesIds).to.not.contain(skillPrerequisiteToRemove.id);
                });
                testing_1.it('should raise changing skill prerequisite event correctly', function () {
                    chai_1.expect(changingSkillPrerequisiteRaises).to.deep.equal([false]);
                });
                testing_1.it('should raise skill prerequisites changed correctly', function () {
                    chai_1.expect(skillPrerequisitesChangedRaises).to.deep.equal([component.skillPrerequisites]);
                });
            });
        });
    });
});
//# sourceMappingURL=skillPrerequisitesList.component.test.js.map