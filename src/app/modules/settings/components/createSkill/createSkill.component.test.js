"use strict";
var skillServiceMockFactory_1 = require("../../../../testUtils/mockFactories/skillServiceMockFactory");
var formFiller_1 = require("../../../../testUtils/formFiller");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var skillService_1 = require("../../../common/services/skillService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var createSkill_component_1 = require('./createSkill.component');
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var skillExistsValidator_1 = require("../../../common/validators/skillExistsValidator");
testing_1.describe('CreateSkillComponent', function () {
    var skillServiceMock;
    var component;
    var skillExistsResult;
    var skillExistsValidatorMock;
    var skillExistsValidatorFactoryMock;
    var skillExistsValidatorBindControlSpy;
    var createSkillExistsValidatorSpy;
    var destroySkillExistsValidatorSpy;
    testing_1.beforeEachProviders(function () {
        skillServiceMock = skillServiceMockFactory_1.SkillServiceMockFactory.createSkillServiceMock();
        skillExistsValidatorMock = {
            bindControl: function () { },
            isExists: function () {
                skillExistsResult = new Subject_1.Subject();
                return skillExistsResult;
            },
            destroy: function () { return null; }
        };
        skillExistsValidatorBindControlSpy =
            sinon_1.spy(skillExistsValidatorMock, 'bindControl');
        skillExistsValidatorFactoryMock = {
            create: function () { return skillExistsValidatorMock; },
            createWithAllowedSkills: function () { return null; }
        };
        createSkillExistsValidatorSpy =
            sinon_1.spy(skillExistsValidatorFactoryMock, 'create');
        destroySkillExistsValidatorSpy =
            sinon_1.spy(skillExistsValidatorMock, 'destroy');
        return [
            forms_1.FormBuilder,
            core_1.provide(skillService_1.SkillService, { useValue: skillServiceMock }),
            core_1.provide(skillExistsValidator_1.SkillExistsValidatorFactory, { useValue: skillExistsValidatorFactoryMock }),
            createSkill_component_1.CreateSkillComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([createSkill_component_1.CreateSkillComponent], function (_component) {
        component = _component;
    }));
    testing_1.describe('initialize', function () {
        var updateTextFieldsSpy;
        var skillNameControl;
        testing_1.beforeEach(testing_1.fakeAsync(function () {
            component.ngOnInit();
            updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
            skillNameControl =
                component.createSkillFormGroup.controls['skillName'];
            testing_1.tick(0);
        }));
        testing_1.afterEach(function () {
            updateTextFieldsSpy.restore();
        });
        testing_1.it('when the component is destroyed should destroy the SkillExistsValidator', function () {
            component.ngOnDestroy();
            chai_1.expect(destroySkillExistsValidatorSpy.callCount).to.be.equal(1);
        });
        testing_1.it('createSkillError should be correct', function () {
            chai_1.expect(component.createSkillError).to.be.undefined;
        });
        testing_1.it('creatingSkill should be correct', function () {
            chai_1.expect(component.creatingSkill).to.be.false;
        });
        testing_1.it('isSkillCreated should be correct', function () {
            chai_1.expect(component.isSkillCreated).to.be.false;
        });
        testing_1.it('the skillName should be correct', function () {
            chai_1.expect(component.skillName).to.be.equal('');
        });
        testing_1.it('should initialize the createSkillFormGroup', function () {
            chai_1.expect(component.createSkillFormGroup).to.exist;
        });
        testing_1.it('should call Materialize.updateTextFields()', function () {
            chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });
        testing_1.it('canCreateSkill should return false', function () {
            chai_1.expect(component.canCreateSkill()).to.be.false;
        });
        testing_1.describe('skill name', function () {
            testing_1.it('value should be correct', function () {
                chai_1.expect(skillNameControl.value).to.be.equal('');
            });
            testing_1.it('should initialize the SkillExistsValidator correctly', function () {
                chai_1.expect(createSkillExistsValidatorSpy.callCount).to.be.equal(1);
            });
            testing_1.it('should bind the SkillExistsValidator to skill name control', function () {
                chai_1.expect(skillExistsValidatorBindControlSpy.callCount).to.be.equal(1);
                chai_1.expect(skillExistsValidatorBindControlSpy.args[0][0]).to.be.equal(skillNameControl);
            });
            testing_1.describe('change the skill name', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
                        component.skillName = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(skillNameControl.errors).to.exist;
                    });
                    testing_1.it('canCreateSkill should return false', function () {
                        chai_1.expect(component.canCreateSkill()).to.be.false;
                    });
                });
                testing_1.describe('to some skill name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some skill name';
                        formFiller_1.FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
                        component.skillName = value;
                        skillExistsResult.next(null);
                        skillExistsResult.complete();
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(skillNameControl.errors).to.not.exist;
                    });
                    testing_1.it('canCreateSkill should return true', function () {
                        chai_1.expect(component.canCreateSkill()).to.be.true;
                    });
                    testing_1.describe('clear skill name', function () {
                        testing_1.beforeEach(function () {
                            var value = '';
                            formFiller_1.FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
                            component.skillName = value;
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(skillNameControl.errors).to.exist;
                        });
                        testing_1.it('canCreateSkill should return false', function () {
                            chai_1.expect(component.canCreateSkill()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to existing skill name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'existing skill name';
                        formFiller_1.FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, value);
                        component.skillName = value;
                        skillExistsResult.next({ 'someError': true });
                        skillExistsResult.complete();
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(skillNameControl.errors).to.exist;
                    });
                    testing_1.it('canCreateSkill should return false', function () {
                        chai_1.expect(component.canCreateSkill()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('createSkill()', function () {
            var skillName;
            var createSkillResult;
            var createSkillSpyStub;
            testing_1.beforeEach(function () {
                skillName = 'some skill name';
                var skillNameControl = component.createSkillFormGroup.controls['skillName'];
                formFiller_1.FormFiller.fillFormControl(component.createSkillFormGroup, skillNameControl, skillName);
                component.skillName = skillName;
                skillExistsResult.next(null);
                skillExistsResult.complete();
                createSkillSpyStub =
                    sinon_1.stub(skillServiceMock, 'createSkill', function () {
                        createSkillResult = new Subject_1.Subject();
                        return createSkillResult;
                    });
                component.createSkill();
            });
            testing_1.afterEach(function () {
                createSkillSpyStub.restore();
            });
            testing_1.it('should call skillService.createSkill() correctly', function () {
                chai_1.expect(createSkillSpyStub.callCount).to.be.equal(1);
                chai_1.expect(createSkillSpyStub.args[0]).to.be.deep.equal([skillName]);
            });
            testing_1.it('should set creatingSkill to true', function () {
                chai_1.expect(component.creatingSkill).to.be.true;
            });
            testing_1.it('should set createSkillError to null', function () {
                chai_1.expect(component.createSkillError).to.be.null;
            });
            testing_1.it('isSkillCreated should be correct', function () {
                chai_1.expect(component.isSkillCreated).to.be.false;
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'create skill error';
                    createSkillResult.error(error);
                });
                testing_1.it('should set creatingSkill to false', function () {
                    chai_1.expect(component.creatingSkill).to.be.false;
                });
                testing_1.it('should set createSkillError correctly', function () {
                    chai_1.expect(component.createSkillError).to.be.equal(error);
                });
                testing_1.it('isSkillCreated should be correct', function () {
                    chai_1.expect(component.isSkillCreated).to.be.false;
                });
            });
            testing_1.describe('updating succeeds', function () {
                var skillDetails;
                var emittedSkillDetails;
                testing_1.beforeEach(function () {
                    skillDetails = {
                        skillName: 'some created skill name',
                        id: 12345
                    };
                    component.skillCreatedEvent.subscribe(function (_actualDetails) {
                        emittedSkillDetails = _actualDetails;
                    });
                    createSkillResult.next(skillDetails);
                    createSkillResult.complete();
                });
                testing_1.it('should set creatingSkill to false', function () {
                    chai_1.expect(component.creatingSkill).to.be.false;
                });
                testing_1.it('should set createSkillError to null', function () {
                    chai_1.expect(component.createSkillError).to.be.null;
                });
                testing_1.it('canCreateSkill() should return false', function () {
                    chai_1.expect(component.canCreateSkill()).to.be.false;
                });
                testing_1.it('isSkillCreated should be correct', function () {
                    chai_1.expect(component.isSkillCreated).to.be.true;
                });
                testing_1.it('should raise skill created event correctly', function () {
                    chai_1.expect(emittedSkillDetails).to.be.deep.equal(skillDetails);
                });
                testing_1.it('should clear skillName', function () {
                    chai_1.expect(component.skillName).to.be.empty;
                });
                testing_1.it('should set the form controls as untouched', function () {
                    chai_1.expect(skillNameControl.touched).to.be.false;
                });
                testing_1.it('should set the form controls as pristine', function () {
                    chai_1.expect(skillNameControl.pristine).to.be.true;
                });
                testing_1.it('should call Materialize.updateTextFields()', function () {
                    chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
                });
                testing_1.describe('createSkill()', function () {
                    testing_1.beforeEach(function () {
                        component.createSkill();
                    });
                    testing_1.it('isSkillCreated should be correct', function () {
                        chai_1.expect(component.isSkillCreated).to.be.false;
                    });
                    testing_1.it('should set creatingSkill to true', function () {
                        chai_1.expect(component.creatingSkill).to.be.true;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=createSkill.component.test.js.map