import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {TeamServiceMockFactory} from "../../../../testUtils/mockFactories/teamServiceMockFactory";
import {IValidationResult} from "../../../common/validators/iValidationResult";
import {FormFiller} from "../../../../testUtils/formFiller";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
  tick,
  fakeAsync
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {ITeamService, TeamService} from "../../../common/services/teamService";
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { CreateTeamComponent } from './createTeam.component';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ITeamExistsValidator,
  TeamExistsValidator,
  ITeamExistsValidatorFactory,
  TeamExistsValidatorFactory
} from "../../../common/validators/teamExistsValidator";

describe('CreateTeamComponent', () => {

  var teamServiceMock: ITeamService;
  var component: CreateTeamComponent;
  var teamExistsResult: Subject<IValidationResult>;
  var teamExistsValidatorMock: ITeamExistsValidator;
  var teamExistsValidatorFactoryMock: ITeamExistsValidatorFactory;
  var teamExistsValidatorBindControlSpy: SinonSpy;
  var createTeamExistsValidatorSpy: SinonSpy;
  var destroyTeamExistsValidatorSpy: SinonSpy;

  beforeEachProviders(() => {
    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();

    teamExistsValidatorMock = {
      bindControl: () => { },
      isExists: () => {
        teamExistsResult = new Subject<IValidationResult>();

        return teamExistsResult;
      },
      destroy: () => null
    }

    teamExistsValidatorBindControlSpy =
      spy(teamExistsValidatorMock, 'bindControl');

    teamExistsValidatorFactoryMock = {
      create: () => teamExistsValidatorMock,
      createWithAllowedTeams: () => null
    }

    createTeamExistsValidatorSpy =
      spy(teamExistsValidatorFactoryMock, 'create');

    destroyTeamExistsValidatorSpy =
      spy(teamExistsValidatorMock, 'destroy');

    return [
      FormBuilder,
      provide(TeamService, { useValue: teamServiceMock }),
      provide(TeamExistsValidatorFactory, { useValue: teamExistsValidatorFactoryMock }),
      CreateTeamComponent
    ];
  });

  beforeEach(inject([CreateTeamComponent], (_component: CreateTeamComponent) => {
    component = _component;
  }));

  describe('initialize', () => {

    var updateTextFieldsSpy: SinonSpy;
    var teamNameControl: FormControl;

    beforeEach(fakeAsync(() => {
      component.ngOnInit();

      updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

      teamNameControl =
        <FormControl>component.createTeamFormGroup.controls['teamName'];

      tick(0);
    }));

    afterEach(() => {
      updateTextFieldsSpy.restore();
    });

    it('when the component is destroyed should destroy the TeamExistsValidator', () => {
      component.ngOnDestroy();

      expect(destroyTeamExistsValidatorSpy.callCount).to.be.equal(1);
    });

    it('createTeamError should be correct', () => {
      expect(component.createTeamError).to.be.undefined;
    });

    it('creatingTeam should be correct', () => {
      expect(component.creatingTeam).to.be.false;
    });

    it('isTeamCreated should be correct', () => {
      expect(component.isTeamCreated).to.be.false;
    });

    it('the teamName should be correct', () => {
      expect(component.teamName).to.be.equal('');
    });

    it('should initialize the createTeamFormGroup', () => {
      expect(component.createTeamFormGroup).to.exist;
    });

    it('should call Materialize.updateTextFields()', () => {
      expect(updateTextFieldsSpy.callCount).to.be.equal(1);
    });

    it('canCreateTeam should return false', () => {
      expect(component.canCreateTeam()).to.be.false;
    });

    describe('team name', () => {

      it('value should be correct', () => {
        expect(teamNameControl.value).to.be.equal('');
      });

      it('should initialize the TeamExistsValidator correctly', () => {
        expect(createTeamExistsValidatorSpy.callCount).to.be.equal(1);
      });

      it('should bind the TeamExistsValidator to team name control', () => {
        expect(teamExistsValidatorBindControlSpy.callCount).to.be.equal(1);
        expect(teamExistsValidatorBindControlSpy.args[0][0]).to.be.equal(teamNameControl);
      });

      describe('change the team name', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
            component.teamName = value;
          });

          it('control should be invalid', () => {
            expect(teamNameControl.errors).to.exist;
          });

          it('canCreateTeam should return false', () => {
            expect(component.canCreateTeam()).to.be.false;
          });

        });

        describe('to some team name', () => {

          beforeEach(() => {
            var value = 'some team name';
            FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
            component.teamName = value;

            teamExistsResult.next(null);
            teamExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(teamNameControl.errors).to.not.exist;
          });

          it('canCreateTeam should return true', () => {
            expect(component.canCreateTeam()).to.be.true;
          });

          describe('clear team name', () => {

            beforeEach(() => {
              var value = '';
              FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
              component.teamName = value;
            });

            it('control should be valid', () => {
              expect(teamNameControl.errors).to.exist;
            });

            it('canCreateTeam should return false', () => {
              expect(component.canCreateTeam()).to.be.false;
            });

          });

        });

        describe('to existing team name', () => {

          beforeEach(() => {
            var value = 'existing team name';
            FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, value);
            component.teamName = value;

            teamExistsResult.next({ 'someError': true });
            teamExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(teamNameControl.errors).to.exist;
          });

          it('canCreateTeam should return false', () => {
            expect(component.canCreateTeam()).to.be.false;
          });

        });

      });

    });

    describe('createTeam()', () => {

      var teamName: string;
      var createTeamResult: Subject<ITeamNameDetails>;
      var createTeamStub: SinonSpy;

      beforeEach(() => {
        teamName = 'some team name';

        var teamNameControl = <FormControl>component.createTeamFormGroup.controls['teamName'];

        FormFiller.fillFormControl(component.createTeamFormGroup, teamNameControl, teamName);
        component.teamName = teamName;
        teamExistsResult.next(null);
        teamExistsResult.complete();

        createTeamStub =
          stub(teamServiceMock, 'createTeam', () => {
            createTeamResult = new Subject<ITeamNameDetails>();
            return createTeamResult;
          });

        component.createTeam();
      });

      afterEach(() => {
        createTeamStub.restore();
      })

      it('should call teamService.createTeam() correctly', () => {
        expect(createTeamStub.callCount).to.be.equal(1);
        expect(createTeamStub.args[0]).to.be.deep.equal([teamName]);
      });

      it('should set creatingTeam to true', () => {
        expect(component.creatingTeam).to.be.true;
      });

      it('should set createTeamError to null', () => {
        expect(component.createTeamError).to.be.null;
      });

      it('isTeamCreated should be correct', () => {
        expect(component.isTeamCreated).to.be.false;
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'create team error';

          createTeamResult.error(error);
        });

        it('should set creatingTeam to false', () => {
          expect(component.creatingTeam).to.be.false;
        });

        it('should set createTeamError correctly', () => {
          expect(component.createTeamError).to.be.equal(error);
        });

        it('isTeamCreated should be correct', () => {
          expect(component.isTeamCreated).to.be.false;
        });

      });

      describe('updating succeeds', () => {

        var teamDetails: ITeamNameDetails;
        var emittedTeamDetails: ITeamNameDetails;

        beforeEach(() => {
          teamDetails = {
            teamName: 'some created team name',
            id: 12345
          }

          component.teamCreatedEvent.subscribe((_actualDetails: ITeamNameDetails) => {
            emittedTeamDetails = _actualDetails;
          });

          createTeamResult.next(teamDetails);
          createTeamResult.complete();
        });

        it('should set creatingTeam to false', () => {
          expect(component.creatingTeam).to.be.false;
        });

        it('should set createTeamError to null', () => {
          expect(component.createTeamError).to.be.null;
        });

        it('canCreateTeam() should return false', () => {
          expect(component.canCreateTeam()).to.be.false;
        });

        it('isTeamCreated should be correct', () => {
          expect(component.isTeamCreated).to.be.true;
        });

        it('should raise team created event correctly', () => {
          expect(emittedTeamDetails).to.be.deep.equal(teamDetails);
        });

        it('should clear teamName', () => {
          expect(component.teamName).to.be.empty;
        });

        it('should set the form controls as untouched', () => {
          expect(teamNameControl.touched).to.be.false;
        });

        it('should set the form controls as pristine', () => {
          expect(teamNameControl.pristine).to.be.true;
        });

        it('should call Materialize.updateTextFields()', () => {
          expect(updateTextFieldsSpy.callCount).to.be.equal(1);
        });

        describe('createTeam()', () => {

          beforeEach(() => {
            component.createTeam();
          });

          it('isTeamCreated should be correct', () => {
            expect(component.isTeamCreated).to.be.false;
          });

          it('should set creatingTeam to true', () => {
            expect(component.creatingTeam).to.be.true;
          });

        });

      });

    })

  });

});
