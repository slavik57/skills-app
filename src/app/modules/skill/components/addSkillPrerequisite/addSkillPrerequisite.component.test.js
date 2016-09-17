"use strict";
var skillServiceMockFactory_1 = require("../../../../testUtils/mockFactories/skillServiceMockFactory");
var formFiller_1 = require("../../../../testUtils/formFiller");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var skillService_1 = require("../../../common/services/skillService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var addSkillPrerequisite_component_1 = require("./addSkillPrerequisite.component");
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var skillNotExistsValidator_1 = require("../../../common/validators/skillNotExistsValidator");
testing_1.describe('AddSkillPrerequisiteComponent', function () {
    var skillDetails;
    var skillServiceMock;
    var component;
    var getSkillsDetailsByPartialSkillNameSpy;
    var getSkillsDetailsByPartialSkillNameResult;
    var skillNotExistsResult;
    var skillNotExistsValidatorMock;
    var skillNotExistsValidatorFactoryMock;
    var skillNotExistsValidatorBindControlSpy;
    var createSkillNotExistsValidatorSpy;
    var destroySkillNotExistsValidatorSpy;
    testing_1.beforeEachProviders(function () {
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        getSkillsDetailsByPartialSkillNameSpy =
            sinon_1.stub(skillServiceMock, 'getSkillsDetailsByPartialSkillName', function () {
                getSkillsDetailsByPartialSkillNameResult = new Subject_1.Subject();
                return getSkillsDetailsByPartialSkillNameResult;
            });
        skillNotExistsValidatorMock = {
            bindControl: function () { },
            isExists: function () {
                skillNotExistsResult = new Subject_1.Subject();
                return skillNotExistsResult;
            },
            destroy: function () { return null; }
        };
        skillNotExistsValidatorBindControlSpy =
            sinon_1.spy(skillNotExistsValidatorMock, 'bindControl');
        skillNotExistsValidatorFactoryMock = {
            create: function () { return skillNotExistsValidatorMock; },
        };
        createSkillNotExistsValidatorSpy =
            sinon_1.spy(skillNotExistsValidatorFactoryMock, 'create');
        destroySkillNotExistsValidatorSpy =
            sinon_1.spy(skillNotExistsValidatorMock, 'destroy');
        return [
            forms_1.FormBuilder,
            core_1.provide(skillService_1.SkillService, { useValue: skillServiceMock }),
            core_1.provide(skillNotExistsValidator_1.SkillNotExistsValidatorFactory, { useValue: skillNotExistsValidatorFactoryMock }),
            addSkillPrerequisite_component_1.AddSkillPrerequisiteComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([addSkillPrerequisite_component_1.AddSkillPrerequisiteComponent], function (_component) {
        component = _component;
        skillDetails = {
            id: 12334,
            skillName: 'some skill name'
        };
        component.skillDetails = skillDetails;
    }));
    testing_1.describe('initialize', function () {
        testing_1.beforeEach(function () {
            component.ngOnInit();
        });
        testing_1.describe('skillsByPartialSkillNameSource.getItems', function () {
            var partialSkillName;
            var actualSkills;
            var actualError;
            testing_1.beforeEach(function () {
                partialSkillName = 'partialSkillName';
                component.skillsByPartialSkillNameSource.getItems(partialSkillName)
                    .subscribe(function (_skills) {
                    actualSkills = _skills;
                }, function (_error) {
                    actualError = _error;
                });
            });
            testing_1.it('should call skillService.getSkillsDetailsByPartialSkillName', function () {
                chai_1.expect(getSkillsDetailsByPartialSkillNameSpy.callCount).to.be.equal(1);
                chai_1.expect(getSkillsDetailsByPartialSkillNameSpy.args[0]).to.deep.equal([partialSkillName, addSkillPrerequisite_component_1.AddSkillPrerequisiteComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS]);
            });
            testing_1.describe('service fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'some error';
                    getSkillsDetailsByPartialSkillNameResult.error(error);
                });
                testing_1.it('should fail correctly', function () {
                    chai_1.expect(actualError).to.be.equal(error);
                });
            });
            testing_1.describe('service succeeds', function () {
                var skills;
                testing_1.beforeEach(function () {
                    skills = [
                        {
                            id: 1,
                            skillName: 'skillName1'
                        },
                        {
                            id: 2,
                            skillName: 'skillName2'
                        }];
                    getSkillsDetailsByPartialSkillNameResult.next(skills);
                    getSkillsDetailsByPartialSkillNameResult.complete();
                });
                testing_1.it('should return correct result', function () {
                    chai_1.expect(actualSkills).to.be.equal(skills);
                });
            });
        });
        testing_1.it('skillsByPartialSkillNameSource.convertItemToString should return the skill name', function () {
            var skillName = 'some skillName1';
            var userDetails = {
                id: 123,
                skillName: skillName
            };
            chai_1.expect(component.skillsByPartialSkillNameSource.converItemToString(userDetails)).to.be.equal(skillName);
        });
        testing_1.it('when the component is destroyed should destroy the SkillNotExistsValidator', function () {
            component.ngOnDestroy();
            chai_1.expect(destroySkillNotExistsValidatorSpy.callCount).to.be.equal(1);
        });
        testing_1.it('addSkillPrerequisiteError should be correct', function () {
            chai_1.expect(component.addSkillPrerequisiteError).to.be.undefined;
        });
        testing_1.it('isAddingSkillPrerequisite should be correct', function () {
            chai_1.expect(component.isAddingSkillPrerequisite).to.be.false;
        });
        testing_1.it('should initialize the addSkillPrerequisiteFormGroup', function () {
            chai_1.expect(component.addSkillPrerequisiteFormGroup).to.exist;
        });
        testing_1.it('canAddSkillPrerequisite() should return false', function () {
            chai_1.expect(component.canAddSkillPrerequisite()).to.be.false;
        });
        testing_1.describe('skillNameControl', function () {
            testing_1.it('value should be correct', function () {
                chai_1.expect(component.skillNameControl.value).to.be.equal('');
            });
            testing_1.it('should initialize the SkillNotExistsValidator correctly', function () {
                chai_1.expect(createSkillNotExistsValidatorSpy.callCount).to.be.equal(1);
            });
            testing_1.it('should bind the SkillNotExistsValidator to skillNameControl', function () {
                chai_1.expect(skillNotExistsValidatorBindControlSpy.callCount).to.be.equal(1);
                chai_1.expect(skillNotExistsValidatorBindControlSpy.args[0][0]).to.be.equal(component.skillNameControl);
            });
            testing_1.describe('change the skill name', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(component.skillNameControl.errors).to.exist;
                    });
                    testing_1.it('canAddSkillPrerequisite() should return false', function () {
                        chai_1.expect(component.canAddSkillPrerequisite()).to.be.false;
                    });
                });
                testing_1.describe('to some skill name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some skill name';
                        formFiller_1.FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);
                        skillNotExistsResult.next(null);
                        skillNotExistsResult.complete();
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(component.skillNameControl.errors).to.not.exist;
                    });
                    testing_1.it('canAddSkillPrerequisite() should return true', function () {
                        chai_1.expect(component.canAddSkillPrerequisite()).to.be.true;
                    });
                    testing_1.describe('clear skill name', function () {
                        testing_1.beforeEach(function () {
                            var value = '';
                            formFiller_1.FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(component.skillNameControl.errors).to.exist;
                        });
                        testing_1.it('canAddSkillPrerequisite() should return false', function () {
                            chai_1.expect(component.canAddSkillPrerequisite()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to existing skill name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'existing skill name';
                        formFiller_1.FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, value);
                        skillNotExistsResult.next({ 'someError': true });
                        skillNotExistsResult.complete();
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(component.skillNameControl.errors).to.exist;
                    });
                    testing_1.it('canAddSkillPrerequisite() should return false', function () {
                        chai_1.expect(component.canAddSkillPrerequisite()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('addSkillPrerequisite()', function () {
            var skillName;
            var addSkillPrerequisiteResult;
            var addSkillPrerequisiteSpy;
            var emittedSkillPrerequisites;
            testing_1.beforeEach(function () {
                skillName = 'some skill name';
                formFiller_1.FormFiller.fillFormControl(component.addSkillPrerequisiteFormGroup, component.skillNameControl, skillName);
                skillNotExistsResult.next(null);
                skillNotExistsResult.complete();
                addSkillPrerequisiteSpy =
                    sinon_1.stub(skillServiceMock, 'addSkillPrerequisite', function () {
                        addSkillPrerequisiteResult = new Subject_1.Subject();
                        return addSkillPrerequisiteResult;
                    });
                emittedSkillPrerequisites = [];
                component.skillPrerequisiteAddedEvent.subscribe(function (_skillPrerequisite) {
                    emittedSkillPrerequisites.push(_skillPrerequisite);
                });
                component.addSkillPrerequisite();
            });
            testing_1.afterEach(function () {
                addSkillPrerequisiteSpy.restore();
            });
            testing_1.it('should call skillService.addSkillPrerequisite() correctly', function () {
                chai_1.expect(addSkillPrerequisiteSpy.callCount).to.be.equal(1);
                chai_1.expect(addSkillPrerequisiteSpy.args[0]).to.be.deep.equal([skillDetails.id, skillName]);
            });
            testing_1.it('should set isAddingSkillPrerequisite to true', function () {
                chai_1.expect(component.isAddingSkillPrerequisite).to.be.true;
            });
            testing_1.it('should set addSkillPrerequisiteError to null', function () {
                chai_1.expect(component.addSkillPrerequisiteError).to.be.null;
            });
            testing_1.it('skillPrerequisiteAddedEvent should not be emitted', function () {
                chai_1.expect(emittedSkillPrerequisites).to.deep.equal([]);
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'create skill prerequisite error';
                    addSkillPrerequisiteResult.error(error);
                });
                testing_1.it('should set isAddingSkilPrerequisite to false', function () {
                    chai_1.expect(component.isAddingSkillPrerequisite).to.be.false;
                });
                testing_1.it('should set addSkillPrerequisiteError correctly', function () {
                    chai_1.expect(component.addSkillPrerequisiteError).to.be.equal(error);
                });
                testing_1.it('skillPrerequisiteAddedEvent should not be emitted', function () {
                    chai_1.expect(emittedSkillPrerequisites).to.deep.equal([]);
                });
            });
            testing_1.describe('updating succeeds', function () {
                var addedSkillPrerequisite;
                var updateTextFieldsSpy;
                testing_1.beforeEach(testing_1.fakeAsync(function () {
                    addedSkillPrerequisite = {
                        id: 12345,
                        skillName: 'some added skill name'
                    };
                    updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
                    addSkillPrerequisiteResult.next(addedSkillPrerequisite);
                    addSkillPrerequisiteResult.complete();
                    testing_1.tick(0);
                }));
                testing_1.afterEach(function () {
                    updateTextFieldsSpy.restore();
                });
                testing_1.it('should set isAddingSkillPrerequisite to false', function () {
                    chai_1.expect(component.isAddingSkillPrerequisite).to.be.false;
                });
                testing_1.it('should set addSkillPrerequisiteError to null', function () {
                    chai_1.expect(component.addSkillPrerequisiteError).to.be.null;
                });
                testing_1.it('canAddSkillPrerequisite() should return false', function () {
                    chai_1.expect(component.canAddSkillPrerequisite()).to.be.false;
                });
                testing_1.it('should raise skill prerequisite created event correctly', function () {
                    chai_1.expect(emittedSkillPrerequisites).to.be.deep.equal([addedSkillPrerequisite]);
                });
                testing_1.it('should clear the skillNameControl', function () {
                    chai_1.expect(component.skillNameControl.value).to.be.empty;
                });
                testing_1.it('should set the skillNameControl as untouched', function () {
                    chai_1.expect(component.skillNameControl.touched).to.be.false;
                });
                testing_1.it('should set the skillNameControl as pristine', function () {
                    chai_1.expect(component.skillNameControl.pristine).to.be.true;
                });
                testing_1.it('should call Materialize.updateTextFields()', function () {
                    chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
                });
                testing_1.describe('addSkillPrerequisite()', function () {
                    testing_1.beforeEach(function () {
                        component.addSkillPrerequisite();
                    });
                    testing_1.it('should set isAddingSkillPrerequisite to true', function () {
                        chai_1.expect(component.isAddingSkillPrerequisite).to.be.true;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=addSkillPrerequisite.component.test.js.map