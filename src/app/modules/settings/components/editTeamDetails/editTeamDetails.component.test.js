"use strict";
var teamServiceMockFactory_1 = require("../../../../testUtils/mockFactories/teamServiceMockFactory");
var formFiller_1 = require("../../../../testUtils/formFiller");
var testing_1 = require('@angular/core/testing');
var core_1 = require('@angular/core');
var teamService_1 = require("../../../common/services/teamService");
var sinon_1 = require('sinon');
var chai_1 = require('chai');
var editTeamDetails_component_1 = require('./editTeamDetails.component');
var Subject_1 = require('rxjs/Subject');
var forms_1 = require('@angular/forms');
var teamExistsValidator_1 = require("../../../common/validators/teamExistsValidator");
testing_1.describe('EditTeamDetailsComponent', function () {
    var teamDetails;
    var teamServiceMock;
    var component;
    var teamExistsResult;
    var teamExistsValidatorMock;
    var teamExistsValidatorFactoryMock;
    var teamExistsValidatorBindControlSpy;
    var createTeamExistsValidatorSpy;
    var destroyTeamExistsValidatorSpy;
    testing_1.beforeEachProviders(function () {
        teamDetails = {
            id: 1,
            teamName: 'some team name'
        };
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
            create: function () { return null; },
            createWithAllowedTeams: function () { return teamExistsValidatorMock; }
        };
        createTeamExistsValidatorSpy =
            sinon_1.spy(teamExistsValidatorFactoryMock, 'createWithAllowedTeams');
        destroyTeamExistsValidatorSpy =
            sinon_1.spy(teamExistsValidatorMock, 'destroy');
        return [
            forms_1.FormBuilder,
            core_1.provide(teamService_1.TeamService, { useValue: teamServiceMock }),
            core_1.provide(teamExistsValidator_1.TeamExistsValidatorFactory, { useValue: teamExistsValidatorFactoryMock }),
            editTeamDetails_component_1.EditTeamDetailsComponent
        ];
    });
    testing_1.beforeEach(testing_1.inject([editTeamDetails_component_1.EditTeamDetailsComponent], function (_component) {
        component = _component;
    }));
    testing_1.it('initializing without the team details should throw error', testing_1.inject([editTeamDetails_component_1.EditTeamDetailsComponent], function (_component) {
        _component.teamDetails = null;
        chai_1.expect(function () { return _component.ngOnInit(); }).to.throw('teamDetails is not set');
    }));
    testing_1.describe('fill team', function () {
        var updateTextFieldsSpy;
        testing_1.beforeEach(testing_1.fakeAsync(function () {
            component.teamDetails = teamDetails;
            component.ngOnInit();
            updateTextFieldsSpy = sinon_1.spy(Materialize, 'updateTextFields');
            testing_1.tick(0);
            teamExistsResult.next(null);
            teamExistsResult.complete();
        }));
        testing_1.afterEach(function () {
            updateTextFieldsSpy.restore();
        });
        testing_1.it('when the component is destroyed should destroy the TeamExistsValidator', function () {
            component.ngOnDestroy();
            chai_1.expect(destroyTeamExistsValidatorSpy.callCount).to.be.equal(1);
        });
        testing_1.it('updatingTeamDetailsError should be correct', function () {
            chai_1.expect(component.updatingTeamDetailsError).to.be.undefined;
        });
        testing_1.it('updatingTeamDetails should be correct', function () {
            chai_1.expect(component.updatingTeamDetails).to.be.false;
        });
        testing_1.it('isTeamDetailsUpdated should be correct', function () {
            chai_1.expect(component.isTeamDetailsUpdated).to.be.false;
        });
        testing_1.it('the teamName should be correct', function () {
            chai_1.expect(component.teamName).to.be.equal(teamDetails.teamName);
        });
        testing_1.it('should initialize the teamDetailsFormGroup', function () {
            chai_1.expect(component.teamDetailsFormGroup).to.exist;
        });
        testing_1.it('should call Materialize.updateTextFields()', function () {
            chai_1.expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });
        testing_1.it('canUpdateTeamDetails should return false', function () {
            chai_1.expect(component.canUpdateTeamDetails()).to.be.false;
        });
        testing_1.describe('team name', function () {
            var teamNameControl;
            testing_1.beforeEach(function () {
                teamNameControl =
                    component.teamDetailsFormGroup.controls['teamName'];
            });
            testing_1.it('value should be correct', function () {
                chai_1.expect(teamNameControl.value).to.be.equal(teamDetails.teamName);
            });
            testing_1.it('should initialize the TeamExistsValidator correctly', function () {
                chai_1.expect(createTeamExistsValidatorSpy.callCount).to.be.equal(1);
                chai_1.expect(createTeamExistsValidatorSpy.args[0][0]).to.be.deep.equal([teamDetails.teamName]);
            });
            testing_1.it('should bind the TeamExistsValidator to teamName control', function () {
                chai_1.expect(teamExistsValidatorBindControlSpy.callCount).to.be.equal(1);
                chai_1.expect(teamExistsValidatorBindControlSpy.args[0][0]).to.be.equal(teamNameControl);
            });
            testing_1.describe('change the team name', function () {
                testing_1.describe('to empty', function () {
                    testing_1.beforeEach(function () {
                        var value = '';
                        formFiller_1.FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
                        component.teamName = value;
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(teamNameControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateTeamDetails should return false', function () {
                        chai_1.expect(component.canUpdateTeamDetails()).to.be.false;
                    });
                });
                testing_1.describe('to different team name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'some other team name';
                        formFiller_1.FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
                        component.teamName = value;
                        teamExistsResult.next(null);
                        teamExistsResult.complete();
                    });
                    testing_1.it('control should be valid', function () {
                        chai_1.expect(teamNameControl.errors).to.not.exist;
                    });
                    testing_1.it('canUpdateTeamDetails should return true', function () {
                        chai_1.expect(component.canUpdateTeamDetails()).to.be.true;
                    });
                    testing_1.describe('restore team name', function () {
                        testing_1.beforeEach(function () {
                            var value = teamDetails.teamName;
                            formFiller_1.FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
                            component.teamName = value;
                            teamExistsResult.next(null);
                            teamExistsResult.complete();
                        });
                        testing_1.it('control should be valid', function () {
                            chai_1.expect(teamNameControl.errors).to.not.exist;
                        });
                        testing_1.it('canUpdateTeamDetails should return false', function () {
                            chai_1.expect(component.canUpdateTeamDetails()).to.be.false;
                        });
                    });
                });
                testing_1.describe('to existing team name', function () {
                    testing_1.beforeEach(function () {
                        var value = 'existing team name';
                        formFiller_1.FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
                        component.teamName = value;
                        teamExistsResult.next({ 'someError': true });
                        teamExistsResult.complete();
                    });
                    testing_1.it('control should be invalid', function () {
                        chai_1.expect(teamNameControl.errors).to.exist;
                    });
                    testing_1.it('canUpdateTeamDetails should return false', function () {
                        chai_1.expect(component.canUpdateTeamDetails()).to.be.false;
                    });
                });
            });
        });
        testing_1.describe('updateUserDetails()', function () {
            var newTeamDetails;
            var updateTeamDetailsResult;
            var updateTeamDetailsStub;
            testing_1.beforeEach(function () {
                newTeamDetails = {
                    id: teamDetails.id,
                    teamName: 'new team name'
                };
                var teamNameControl = component.teamDetailsFormGroup.controls['teamName'];
                formFiller_1.FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, newTeamDetails.teamName);
                component.teamName = newTeamDetails.teamName;
                teamExistsResult.next(null);
                teamExistsResult.complete();
                updateTeamDetailsStub =
                    sinon_1.stub(teamServiceMock, 'updateTeamName', function () {
                        updateTeamDetailsResult = new Subject_1.Subject();
                        return updateTeamDetailsResult;
                    });
                component.updateTeamDetails();
            });
            testing_1.afterEach(function () {
                updateTeamDetailsStub.restore();
            });
            testing_1.it('should call teamService.updateTeamName() correctly', function () {
                var expectedArgs = [
                    newTeamDetails.id,
                    newTeamDetails.teamName,
                ];
                chai_1.expect(updateTeamDetailsStub.callCount).to.be.equal(1);
                chai_1.expect(updateTeamDetailsStub.args[0]).to.be.deep.equal(expectedArgs);
            });
            testing_1.it('should set updatingTeamDetails to true', function () {
                chai_1.expect(component.updatingTeamDetails).to.be.true;
            });
            testing_1.it('should set updatingTeamDetailsError to null', function () {
                chai_1.expect(component.updatingTeamDetailsError).to.be.null;
            });
            testing_1.it('isTeamDetailsUpdated should be correct', function () {
                chai_1.expect(component.isTeamDetailsUpdated).to.be.false;
            });
            testing_1.describe('updating fails', function () {
                var error;
                testing_1.beforeEach(function () {
                    error = 'updateTeamDetails error';
                    updateTeamDetailsResult.error(error);
                });
                testing_1.it('should set updatingTeamDetails to false', function () {
                    chai_1.expect(component.updatingTeamDetails).to.be.false;
                });
                testing_1.it('should set updatingTeamDetailsError correctly', function () {
                    chai_1.expect(component.updatingTeamDetailsError).to.be.equal(error);
                });
                testing_1.it('isTeamDetailsUpdated should be correct', function () {
                    chai_1.expect(component.isTeamDetailsUpdated).to.be.false;
                });
            });
            testing_1.describe('updating succeeds', function () {
                testing_1.beforeEach(function () {
                    updateTeamDetailsResult.next(newTeamDetails);
                    updateTeamDetailsResult.complete();
                });
                testing_1.it('should set updatingTeamDetails to false', function () {
                    chai_1.expect(component.updatingTeamDetails).to.be.false;
                });
                testing_1.it('should set updatingTeamDetailsError to null', function () {
                    chai_1.expect(component.updatingTeamDetailsError).to.be.null;
                });
                testing_1.it('canUpdateTeamDetails should return false', function () {
                    chai_1.expect(component.canUpdateTeamDetails()).to.be.false;
                });
                testing_1.it('should not change the teamDetails reference', function () {
                    chai_1.expect(component.teamDetails).to.be.equal(teamDetails);
                });
                testing_1.it('should update the teamDetails', function () {
                    chai_1.expect(component.teamDetails).to.be.deep.equal(newTeamDetails);
                });
                testing_1.it('isTeamDetailsUpdated should be correct', function () {
                    chai_1.expect(component.isTeamDetailsUpdated).to.be.true;
                });
                testing_1.describe('updateTeamDetails()', function () {
                    testing_1.beforeEach(function () {
                        component.updateTeamDetails();
                    });
                    testing_1.it('isTeamDetailsUpdated should be correct', function () {
                        chai_1.expect(component.isTeamDetailsUpdated).to.be.false;
                    });
                    testing_1.it('should set updatingTeamDetails to true', function () {
                        chai_1.expect(component.updatingTeamDetails).to.be.true;
                    });
                });
            });
        });
    });
});
//# sourceMappingURL=editTeamDetails.component.test.js.map