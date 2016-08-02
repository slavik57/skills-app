"use strict";
var teamServiceMockFactory_1 = require("../../../../testUtils/mockFactories/teamServiceMockFactory");
var formFiller_1 = require("../../../../testUtils/formFiller");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var teamService_1 = require("../../../common/services/teamService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var createTeam_component_1 = require('./createTeam.component');
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var teamExistsValidator_1 = require("../../../common/validators/teamExistsValidator");
testing_1.describe('CreateTeamComponent', function () {
    var teamServiceMock;
    var component;
    var teamExistsResult;
    var teamExistsValidatorMock;
    var teamExistsValidatorFactoryMock;
    var teamExistsValidatorBindControlSpy;
    var createTeamExistsValidatorSpy;
    var destroyTeamExistsValidatorSpy;
    testing_1.beforeEachProviders(function () {
        teamServiceMock = teamServiceMockFactory_1.TeamServiceMockFactory.createTeamServiceMock();
        teamExistsValidatorMock = {
            bindControl: function () { },
            isExists: function () {
                teamExistsResult = new Subject_1.Subject();
                return teamExistsResult;
            },
            destroy: function () { return null; }
        };
        teamExistsValidatorBindControlSpy =
            sinon_1.spy(teamExistsValidatorMock, 'bindControl');
        teamExistsValidatorFactoryMock = {
            create: function () { return teamExistsValidatorMock; },
            createWithAllowedTeams: function () { return null; }
        };
        createTeamExistsValidatorSpy =
            sinon_1.spy(teamExistsValidatorFactoryMock, 'create');
        destroyTeamExistsValidatorSpy =
            sinon_1.spy(teamExistsValidatorMock, 'destroy');
        return [
            forms_1.FormBuilder,
            core_1.provide(teamService_1.TeamService, { useValue: teamServiceMock }),
            core_1.provide(teamExistsValidator_1.TeamExistsValidatorFactory, { useValue: teamExistsValidatorFactoryMock }),
            createTeam_component_1.CreateTeamComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([createTeam_component_1.CreateTeamComponent], function (_component) {
        component = _component;
    }));
    testing_1.describe('initialize', function () {
        var updateTextFieldsSpy;
        var teamNameControl;
        testing_1.beforeEach(testing_1.fakeAsync(function () {
            component.ngOnInit();
            updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
            teamNameControl =
                component.createTeamFormGroup.controls['teamName'];
            testing_1.tick(0);
        }));
        testing_1.afterEach(function () {
            updateTextFieldsSpy.restore();
        });
        testing_1.it('when the component is destroyed should destroy the TeamExistsValidator', function () {
            component.ngOnDestroy();
            chai_1.expect(destroyTeamExistsValidatorSpy.callCount).to.be.equal(1);
        });
        testing_1.it('createTeamError should be correct', function () {
            chai_1.expect(component.createTeamError).to.be.undefined;
        });
        testing_1.it('creatingTeam should be correct', function () {
            chai_1.expect(component.creatingTeam).to.be.false;
        });
        testing_1.it('isTeamCreated should be correct', function () {
            chai_1.expect(component.isTeamCreated).to.be.false;
        });
        testing_1.it('the teamName should be correct', function () {
            chai_1.expect(component.teamName).to.be.equal('');
        });
        testing_1.it('should initialize the createTeamFormGroup', function () {
            chai_1.expect(component.createTeamFormGroup).to.exist;
        });
        testing_1.it('should call Materialize.updateTextFields()', function () {
            chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });
        testing_1.it('canCreateTeam should return false', function () {
            chai_1.expect(component.canCreateTeam()).to.be.false;
        });
        testing_1.describe('team name', function () {
            testing_1.it('value should be correct', function () {
                chai_1.expect(teamNameControl.value).to.be.equal('');
            });
            testing_1.it('should initialize the TeamExistsValidator correctly', function () {
                chai_1.expect(createTeamExistsValidatorSpy.callCount).to.be.equal(1);
            });
            testing_1.it('should bind the TeamExistsValidator to team name control', function () {
                chai_1.expect(teamExistsValidatorBindControlSpy.callCount).to.be.equal(1);
                chai_1.expect(teamExistsValidatorBindControlSpy.args[0][0]).to.be.equal(teamNameControl);
            });
            testing_1.describe('change the team name', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
                        component.teamName = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(teamNameControl.errors).to.exist;
                    });
                    testing_1.it('canCreateTeam should return false', function () {
                        chai_1.expect(component.canCreateTeam()).to.be.false;
                    });
                });
                testing_1.describe('to some team name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some team name';
                        formFiller_1.FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
                        component.teamName = value;
                        teamExistsResult.next(null);
                        teamExistsResult.complete();
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(teamNameControl.errors).to.not.exist;
                    });
                    testing_1.it('canCreateTeam should return true', function () {
                        chai_1.expect(component.canCreateTeam()).to.be.true;
                    });
                    testing_1.describe('clear team name', function () {
                        testing_1.beforeEach(function () {
                            var value = '';
                            formFiller_1.FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
                            component.teamName = value;
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(teamNameControl.errors).to.exist;
                        });
                        testing_1.it('canCreateTeam should return false', function () {
                            chai_1.expect(component.canCreateTeam()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to existing team name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'existing team name';
                        formFiller_1.FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
                        component.teamName = value;
                        teamExistsResult.next({ 'someError': true });
                        teamExistsResult.complete();
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(teamNameControl.errors).to.exist;
                    });
                    testing_1.it('canCreateTeam should return false', function () {
                        chai_1.expect(component.canCreateTeam()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('createTeam()', function () {
            var teamName;
            var createTeamResult;
            var createTeamStub;
            testing_1.beforeEach(function () {
                teamName = 'some team name';
                var teamNameControl = component.createTeamFormGroup.controls['teamName'];
                formFiller_1.FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, teamName);
                component.teamName = teamName;
                teamExistsResult.next(null);
                teamExistsResult.complete();
                createTeamStub =
                    sinon_1.stub(teamServiceMock, 'createTeam', function () {
                        createTeamResult = new Subject_1.Subject();
                        return createTeamResult;
                    });
                component.createTeam();
            });
            testing_1.afterEach(function () {
                createTeamStub.restore();
            });
            testing_1.it('should call teamService.createTeam() correctly', function () {
                chai_1.expect(createTeamStub.callCount).to.be.equal(1);
                chai_1.expect(createTeamStub.args[0]).to.be.deep.equal([teamName]);
            });
            testing_1.it('should set creatingTeam to true', function () {
                chai_1.expect(component.creatingTeam).to.be.true;
            });
            testing_1.it('should set createTeamError to null', function () {
                chai_1.expect(component.createTeamError).to.be.null;
            });
            testing_1.it('isTeamCreated should be correct', function () {
                chai_1.expect(component.isTeamCreated).to.be.false;
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'create team error';
                    createTeamResult.error(error);
                });
                testing_1.it('should set creatingTeam to false', function () {
                    chai_1.expect(component.creatingTeam).to.be.false;
                });
                testing_1.it('should set createTeamError correctly', function () {
                    chai_1.expect(component.createTeamError).to.be.equal(error);
                });
                testing_1.it('isTeamCreated should be correct', function () {
                    chai_1.expect(component.isTeamCreated).to.be.false;
                });
            });
            testing_1.describe('updating succeeds', function () {
                var teamDetails;
                var emittedTeamDetails;
                testing_1.beforeEach(function () {
                    teamDetails = {
                        teamName: 'some created team name',
                        id: 12345
                    };
                    component.teamCreatedEvent.subscribe(function (_actualDetails) {
                        emittedTeamDetails = _actualDetails;
                    });
                    createTeamResult.next(teamDetails);
                    createTeamResult.complete();
                });
                testing_1.it('should set creatingTeam to false', function () {
                    chai_1.expect(component.creatingTeam).to.be.false;
                });
                testing_1.it('should set createTeamError to null', function () {
                    chai_1.expect(component.createTeamError).to.be.null;
                });
                testing_1.it('canCreateTeam() should return false', function () {
                    chai_1.expect(component.canCreateTeam()).to.be.false;
                });
                testing_1.it('isTeamCreated should be correct', function () {
                    chai_1.expect(component.isTeamCreated).to.be.true;
                });
                testing_1.it('should raise team created event correctly', function () {
                    chai_1.expect(emittedTeamDetails).to.be.deep.equal(teamDetails);
                });
                testing_1.it('should clear teamName', function () {
                    chai_1.expect(component.teamName).to.be.empty;
                });
                testing_1.it('should set the form controls as untouched', function () {
                    chai_1.expect(teamNameControl.touched).to.be.false;
                });
                testing_1.it('should set the form controls as pristine', function () {
                    chai_1.expect(teamNameControl.pristine).to.be.true;
                });
                testing_1.it('should call Materialize.updateTextFields()', function () {
                    chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
                });
                testing_1.describe('createTeam()', function () {
                    testing_1.beforeEach(function () {
                        component.createTeam();
                    });
                    testing_1.it('isTeamCreated should be correct', function () {
                        chai_1.expect(component.isTeamCreated).to.be.false;
                    });
                    testing_1.it('should set creatingTeam to true', function () {
                        chai_1.expect(component.creatingTeam).to.be.true;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=createTeam.component.test.js.map