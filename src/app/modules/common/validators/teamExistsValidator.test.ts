import {TeamServiceMockFactory} from "../../../testUtils/mockFactories/teamServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {expect} from 'chai';
import {ITeamService, TeamService} from "../services/teamService";
import {TeamExistsValidator, TeamExistsValidatorFactory} from "./teamExistsValidator";
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {spy, SinonSpy} from 'sinon';

describe('TeamExistsValidatorFactory', () => {

  var teamServiceMock: ITeamService;
  var teamExistsValidatorFactory: TeamExistsValidatorFactory;

  beforeEachProviders(() => {
    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();

    return [
      provide(TeamService, { useValue: teamServiceMock }),
      TeamExistsValidatorFactory
    ];
  });

  beforeEach(inject([TeamExistsValidatorFactory], (_teamExistsValidatorFactory: TeamExistsValidatorFactory) => {
    teamExistsValidatorFactory = _teamExistsValidatorFactory;
  }));

  describe('create', () => {

    it('should create correct TeamExistsValidator', () => {
      var validator = teamExistsValidatorFactory.create();

      expect(validator).to.be.instanceof(TeamExistsValidator);
      expect(validator['teamService']).to.be.equal(teamServiceMock);
      expect(validator['allowedValues']).to.be.deep.equal([]);
    });

  });

  describe('createWithAllowedTeams', () => {

    it('should create correct TeamExistsValidator', () => {
      var teamNames = ['a', 'b', 'c'];
      var validator = teamExistsValidatorFactory.createWithAllowedTeams(teamNames);

      expect(validator).to.be.instanceof(TeamExistsValidator);
      expect(validator['teamService']).to.be.equal(teamServiceMock);
      expect(validator['allowedValues']).to.be.deep.equal(teamNames);
    });

  });

});

describe('TeamExistsValidator', () => {

  var teamName: string;
  var isTeamExistsResult: Subject<boolean>;
  var teamServiceMock: ITeamService;
  var control: FormControl;
  var validator: TeamExistsValidator;
  var originalDebounce: any;
  var validTeamNames: string[];
  var isTeamExistsSpy: SinonSpy;

  beforeEach(() => {
    originalDebounce = Observable.prototype.debounce;
    Observable.prototype.debounceTime = function() {
      return this;
    }

    isTeamExistsResult = new Subject<boolean>();

    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();

    teamServiceMock.isTeamExists = () => isTeamExistsResult;

    control = new FormControl();

    validTeamNames = ['valid team name1', 'valid team name2'];
    validator = new TeamExistsValidator(validTeamNames, teamServiceMock);

    validator.bindControl(control);

    isTeamExistsSpy = spy(teamServiceMock, 'isTeamExists');
  });

  afterEach(() => {
    Observable.prototype.debounce = originalDebounce;
  });

  describe('isExists', () => {

    it('isTeamExists returns true should return error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      teamName = 'some name';
      control.updateValue(teamName);
      control.updateValueAndValidity();

      isTeamExistsResult.next(true);
      isTeamExistsResult.complete();

      expect(actualResult).to.deep.equal({ 'teamNameTaken': true });
    });

    it('isTeamExists returns false should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      teamName = 'some name';
      control.updateValue(teamName);
      control.updateValueAndValidity();

      isTeamExistsResult.next(false);
      isTeamExistsResult.complete();

      expect(actualResult).to.be.null;
    });

    it('isTeamExists rejects should return teamNameTakenCheckFailed error', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      teamName = 'some name';
      control.updateValue(teamName);
      control.updateValueAndValidity();

      isTeamExistsResult.error('some error');

      expect(actualResult).to.deep.equal({ 'teamNameTakenCheckFailed': true });
    });

    it('value changes without subscriber should not fail', () => {
      teamName = 'some name';
      control.updateValue(teamName);
      control.updateValueAndValidity();
    });

    it('null team name should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      teamName = null;
      control.updateValue(teamName);
      control.updateValueAndValidity();

      isTeamExistsResult.error('some error');

      expect(actualResult).to.be.null;
    });

    it('undefined team name should be null', () => {
      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      teamName = undefined;
      control.updateValue(teamName);
      control.updateValueAndValidity();

      isTeamExistsResult.error('some error');

      expect(actualResult).to.be.null;
    });

    it('empty team name should be null', () => {
      validator.isExists(control).subscribe(
        (_result) => {
          expect(_result).to.be.null;
        }
      )

      teamName = '';
      control.updateValue(teamName);
      control.updateValueAndValidity();

      isTeamExistsResult.error('some error');
    });

    it('on valid team name should not use the team service', () => {
      validator.isExists(control);

      control.updateValue(validTeamNames[0]);
      control.updateValueAndValidity();

      expect(isTeamExistsSpy.callCount).to.be.equal(0);
    });

    it('on another valid team name should not use the team service', () => {
      validator.isExists(control);

      control.updateValue(validTeamNames[1]);
      control.updateValueAndValidity();

      expect(isTeamExistsSpy.callCount).to.be.equal(0);
    });

    it('on valid team name should return null', () => {
      control.updateValue(validTeamNames[0]);

      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      );

      control.updateValueAndValidity();

      expect(actualResult).to.be.null;
    });

    it('on another valid team name should return null', () => {
      control.updateValue(validTeamNames[1]);

      var actualResult;
      validator.isExists(control).subscribe(
        (_result) => {
          actualResult = _result;
        }
      )

      control.updateValueAndValidity();

      expect(actualResult).to.be.null;
    });

  });

  describe('destroy', () => {

    beforeEach(() => {
      validator.destroy();
    });

    it('calling destroy before binding to control should not fail', () => {
      new TeamExistsValidator(validTeamNames, teamServiceMock).destroy();
    });

    describe('teamExists', () => {

      it('on subscribtion should not return anything', () => {
        var numberOfTimesCalled = 0;
        validator.isExists(control).subscribe(
          (_result) => {
            numberOfTimesCalled++;
          }
        )

        teamName = 'some name';
        control.updateValue(teamName);
        control.updateValueAndValidity();

        expect(numberOfTimesCalled).to.equal(0);
      });

      it('value changes should not fail', () => {
        teamName = 'some name';
        control.updateValue(teamName);
        control.updateValueAndValidity();
      });

      it('on valid team name should not use the team service', () => {
        validator.isExists(control).subscribe(
          (_result) => {
          }
        );

        teamName = 'some name';
        control.updateValue(teamName);
        control.updateValueAndValidity();

        expect(isTeamExistsSpy.callCount).to.be.equal(0);
      });

    });

  });

});
