import {TeamServiceMockFactory} from "../../../../testUtils/mockFactories/teamServiceMockFactory";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
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
import { EditTeamDetailsComponent } from './editTeamDetails.component';
import { Subject } from 'rxjs/Subject';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  ITeamExistsValidator,
  TeamExistsValidator,
  ITeamExistsValidatorFactory,
  TeamExistsValidatorFactory
} from "../../../common/validators/teamExistsValidator";

describe('EditTeamDetailsComponent', () => {

  var teamDetails: ITeamNameDetails;
  var teamServiceMock: ITeamService;
  var component: EditTeamDetailsComponent;
  var teamExistsResult: Subject<IValidationResult>;
  var teamExistsValidatorMock: ITeamExistsValidator;
  var teamExistsValidatorFactoryMock: ITeamExistsValidatorFactory;
  var teamExistsValidatorBindControlSpy: SinonSpy;
  var createTeamExistsValidatorSpy: SinonSpy;
  var destroyTeamExistsValidatorSpy: SinonSpy;

  beforeEachProviders(() => {
    teamDetails = {
      id: 1,
      teamName: 'some team name'
    };

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
      create: () => null,
      createWithAllowedTeams: () => teamExistsValidatorMock
    }

    createTeamExistsValidatorSpy =
      spy(teamExistsValidatorFactoryMock, 'createWithAllowedTeams');

    destroyTeamExistsValidatorSpy =
      spy(teamExistsValidatorMock, 'destroy');

    return [
      FormBuilder,
      provide(TeamService, { useValue: teamServiceMock }),
      provide(TeamExistsValidatorFactory, { useValue: teamExistsValidatorFactoryMock }),
      EditTeamDetailsComponent
    ];
  });

  beforeEach(inject([EditTeamDetailsComponent], (_component: EditTeamDetailsComponent) => {
    component = _component;
  }));

  it('initializing without the team details should throw error', inject([EditTeamDetailsComponent], (_component: EditTeamDetailsComponent) => {
    _component.teamDetails = null;
    expect(() => _component.ngOnInit()).to.throw('teamDetails is not set');
  }));

  describe('fill team', () => {

    var updateTextFieldsSpy: SinonSpy;

    beforeEach(fakeAsync(() => {
      component.teamDetails = teamDetails;
      component.ngOnInit();

      updateTextFieldsSpy = spy(Materialize, 'updateTextFields');

      tick(0);

      teamExistsResult.next(null);
      teamExistsResult.complete();
    }));

    afterEach(() => {
      updateTextFieldsSpy.restore();
    });

    it('when the component is destroyed should destroy the TeamExistsValidator', () => {
      component.ngOnDestroy();

      expect(destroyTeamExistsValidatorSpy.callCount).to.be.equal(1);
    });

    it('updatingTeamDetailsError should be correct', () => {
      expect(component.updatingTeamDetailsError).to.be.undefined;
    });

    it('updatingTeamDetails should be correct', () => {
      expect(component.updatingTeamDetails).to.be.false;
    });

    it('isTeamDetailsUpdated should be correct', () => {
      expect(component.isTeamDetailsUpdated).to.be.false;
    });

    it('the teamName should be correct', () => {
      expect(component.teamName).to.be.equal(teamDetails.teamName);
    });

    it('should initialize the teamDetailsFormGroup', () => {
      expect(component.teamDetailsFormGroup).to.exist;
    });

    it('should call Materialize.updateTextFields()', () => {
      expect(updateTextFieldsSpy.callCount).to.be.equal(1);
    });

    it('canUpdateTeamDetails should return false', () => {
      expect(component.canUpdateTeamDetails()).to.be.false;
    });

    describe('team name', () => {

      var teamNameControl: FormControl;

      beforeEach(() => {
        teamNameControl =
          <FormControl>component.teamDetailsFormGroup.controls['teamName'];
      });

      it('value should be correct', () => {
        expect(teamNameControl.value).to.be.equal(teamDetails.teamName);
      });

      it('should initialize the TeamExistsValidator correctly', () => {
        expect(createTeamExistsValidatorSpy.callCount).to.be.equal(1);
        expect(createTeamExistsValidatorSpy.args[0][0]).to.be.deep.equal([teamDetails.teamName]);
      });

      it('should bind the TeamExistsValidator to teamName control', () => {
        expect(teamExistsValidatorBindControlSpy.callCount).to.be.equal(1);
        expect(teamExistsValidatorBindControlSpy.args[0][0]).to.be.equal(teamNameControl);
      });

      describe('change the team name', () => {

        describe('to empty', () => {

          beforeEach(() => {
            var value = '';
            FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
            component.teamName = value;
          });

          it('control should be invalid', () => {
            expect(teamNameControl.errors).to.exist;
          });

          it('canUpdateTeamDetails should return false', () => {
            expect(component.canUpdateTeamDetails()).to.be.false;
          });

        });

        describe('to different team name', () => {

          beforeEach(() => {
            var value = 'some other team name';
            FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
            component.teamName = value;

            teamExistsResult.next(null);
            teamExistsResult.complete();
          });

          it('control should be valid', () => {
            expect(teamNameControl.errors).to.not.exist;
          });

          it('canUpdateTeamDetails should return true', () => {
            expect(component.canUpdateTeamDetails()).to.be.true;
          });

          describe('restore team name', () => {

            beforeEach(() => {
              var value = teamDetails.teamName;
              FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
              component.teamName = value;

              teamExistsResult.next(null);
              teamExistsResult.complete();
            });

            it('control should be valid', () => {
              expect(teamNameControl.errors).to.not.exist;
            });

            it('canUpdateTeamDetails should return false', () => {
              expect(component.canUpdateTeamDetails()).to.be.false;
            });

          });

        });

        describe('to existing team name', () => {

          beforeEach(() => {
            var value = 'existing team name';
            FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, value);
            component.teamName = value;

            teamExistsResult.next({ 'someError': true });
            teamExistsResult.complete();
          });

          it('control should be invalid', () => {
            expect(teamNameControl.errors).to.exist;
          });

          it('canUpdateTeamDetails should return false', () => {
            expect(component.canUpdateTeamDetails()).to.be.false;
          });

        });

      });

    });

    describe('updateUserDetails()', () => {

      var newTeamDetails: ITeamNameDetails;
      var updateTeamDetailsResult: Subject<ITeamNameDetails>;
      var updateTeamDetailsStub: SinonSpy;

      beforeEach(() => {
        newTeamDetails = {
          id: teamDetails.id,
          teamName: 'new team name'
        }

        var teamNameControl = <FormControl>component.teamDetailsFormGroup.controls['teamName'];

        FormFiller.fillFormControl(component.teamDetailsFormGroup, teamNameControl, newTeamDetails.teamName);
        component.teamName = newTeamDetails.teamName;
        teamExistsResult.next(null);
        teamExistsResult.complete();

        updateTeamDetailsStub =
          stub(teamServiceMock, 'updateTeamName', () => {
            updateTeamDetailsResult = new Subject<ITeamNameDetails>();
            return updateTeamDetailsResult;
          });

        component.updateTeamDetails();
      });

      afterEach(() => {
        updateTeamDetailsStub.restore();
      })

      it('should call teamService.updateTeamName() correctly', () => {
        var expectedArgs = [
          newTeamDetails.id,
          newTeamDetails.teamName,
        ];

        expect(updateTeamDetailsStub.callCount).to.be.equal(1);
        expect(updateTeamDetailsStub.args[0]).to.be.deep.equal(expectedArgs);
      });

      it('should set updatingTeamDetails to true', () => {
        expect(component.updatingTeamDetails).to.be.true;
      });

      it('should set updatingTeamDetailsError to null', () => {
        expect(component.updatingTeamDetailsError).to.be.null;
      });

      it('isTeamDetailsUpdated should be correct', () => {
        expect(component.isTeamDetailsUpdated).to.be.false;
      });

      describe('updating fails', () => {

        var error: string;

        beforeEach(() => {
          error = 'updateTeamDetails error';

          updateTeamDetailsResult.error(error);
        });

        it('should set updatingTeamDetails to false', () => {
          expect(component.updatingTeamDetails).to.be.false;
        });

        it('should set updatingTeamDetailsError correctly', () => {
          expect(component.updatingTeamDetailsError).to.be.equal(error);
        });

        it('isTeamDetailsUpdated should be correct', () => {
          expect(component.isTeamDetailsUpdated).to.be.false;
        });

      });

      describe('updating succeeds', () => {

        beforeEach(() => {
          updateTeamDetailsResult.next(newTeamDetails);
          updateTeamDetailsResult.complete();
        });

        it('should set updatingTeamDetails to false', () => {
          expect(component.updatingTeamDetails).to.be.false;
        });

        it('should set updatingTeamDetailsError to null', () => {
          expect(component.updatingTeamDetailsError).to.be.null;
        });

        it('canUpdateTeamDetails should return false', () => {
          expect(component.canUpdateTeamDetails()).to.be.false;
        });

        it('should not change the teamDetails reference', () => {
          expect(component.teamDetails).to.be.equal(teamDetails);
        });

        it('should update the teamDetails', () => {
          expect(component.teamDetails).to.be.deep.equal(newTeamDetails);
        });

        it('isTeamDetailsUpdated should be correct', () => {
          expect(component.isTeamDetailsUpdated).to.be.true;
        });

        describe('updateTeamDetails()', () => {

          beforeEach(() => {
            component.updateTeamDetails();
          });

          it('isTeamDetailsUpdated should be correct', () => {
            expect(component.isTeamDetailsUpdated).to.be.false;
          });

          it('should set updatingTeamDetails to true', () => {
            expect(component.updatingTeamDetails).to.be.true;
          });

        });

      });

    })

  });

});
