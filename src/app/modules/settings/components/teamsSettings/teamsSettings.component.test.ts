import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {TeamsSettingsComponent} from "./teamsSettings.component";
import {TeamServiceMockFactory} from "../../../../testUtils/mockFactories/teamServiceMockFactory";
import {
  it,
  inject,
  describe,
  beforeEach,
  afterEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide, NgZone} from '@angular/core';
import {expect} from 'chai';
import {ITeamService, TeamService} from "../../../common/services/teamService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

describe('TeamsSettingsComponent', () => {

  var teamServiceMock: ITeamService;
  var getTeamsDetailsSpy: SinonSpy;
  var getTeamsDetailsResult: Subject<ITeamNameDetails[]>;
  var zoneMock: NgZone;
  var zoneRunSpy: SinonSpy;

  var component: TeamsSettingsComponent;

  beforeEachProviders(() => {

    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();

    getTeamsDetailsSpy =
      stub(teamServiceMock, 'getTeamsDetails', () => {
        getTeamsDetailsResult = new Subject<ITeamNameDetails[]>();
        return getTeamsDetailsResult;
      });

    zoneMock = <any>{
      run: () => null
    }

    zoneRunSpy = spy(zoneMock, 'run');

    return [
      provide(NgZone, { useValue: zoneMock }),
      provide(TeamService, { useValue: teamServiceMock }),
      TeamsSettingsComponent
    ];
  });

  beforeEach(inject([TeamsSettingsComponent], (_component: TeamsSettingsComponent) => {
    component = _component;

    component.teamSettingsModal = {
      nativeElement: {}
    }

    component.ngOnInit();
  }));

  it('isLoadingTeams should be true', () => {
    expect(component.isLoadingTeams).to.be.true;
  });

  it('loadingTeamsError should be null', () => {
    expect(component.loadingTeamsError).to.be.null;
  });

  it('should call teamService.getTeamsDetails()', () => {
    expect(getTeamsDetailsSpy.callCount).to.be.equal(1);
  });

  it('teamsDetails should be null', () => {
    expect(component.teamsDetails).to.be.null;
  });

  it('selectedTeam should be null', () => {
    expect(component.selectedTeam).to.be.null;
  });

  describe('getting teams details fails', () => {

    var error: string;

    beforeEach(() => {
      error = 'some error';
      getTeamsDetailsResult.error(error);
    });

    it('isLoadingTeams should be false', () => {
      expect(component.isLoadingTeams).to.be.false;
    });

    it('loadingTeamsError should be correct', () => {
      expect(component.loadingTeamsError).to.be.equal(error);
    });

    it('teamsDetails should be null', () => {
      expect(component.teamsDetails).to.be.null;
    });

    it('selectedTeam should be null', () => {
      expect(component.selectedTeam).to.be.null;
    });

    describe('reload', () => {

      beforeEach(() => {
        getTeamsDetailsSpy.reset();

        component.reload();
      });

      it('isLoadingTeams should be true', () => {
        expect(component.isLoadingTeams).to.be.true;
      });

      it('loadingTeamsError should be null', () => {
        expect(component.loadingTeamsError).to.be.null;
      });

      it('should call teamService.getTeamsDetails()', () => {
        expect(getTeamsDetailsSpy.callCount).to.be.equal(1);
      });

      it('teamsDetails should be null', () => {
        expect(component.teamsDetails).to.be.null;
      });

      it('selectedTeam should be null', () => {
        expect(component.selectedTeam).to.be.null;
      });

    })

  });

  describe('getting teams details succeeds', () => {

    var teamsDetails: ITeamNameDetails[];

    beforeEach(() => {
      teamsDetails =
        _.map([1, 2, 3], (_id) => {
          return { id: _id, teamName: _id.toString() };
        });

      getTeamsDetailsResult.next(teamsDetails);
      getTeamsDetailsResult.complete();

    });

    it('isLoadingTeams should be false', () => {
      expect(component.isLoadingTeams).to.be.false;
    });

    it('loadingTeamsError should be null', () => {
      expect(component.loadingTeamsError).to.be.null;
    });

    it('teamsDetails should be correct', () => {
      expect(component.teamsDetails).to.deep.equal(teamsDetails);
    });

    it('selectedTeam should be null', () => {
      expect(component.selectedTeam).to.be.null;
    });

    describe('selectTeam', () => {

      var teamToSelect: ITeamNameDetails;
      var jquerySpy: SinonSpy;
      var openModalSpy: SinonSpy;

      beforeEach(() => {
        teamToSelect = teamsDetails[1];

        var jqueryResult = {
          openModal: () => null
        }

        openModalSpy = spy(jqueryResult, 'openModal');

        jquerySpy = stub(window, '$', () => jqueryResult);

        component.selectTeam(teamToSelect);
      });

      afterEach(() => {
        jquerySpy.restore();
      });

      it('should update the selectedTeam correctly', () => {
        expect(component.selectedTeam).to.be.equal(teamToSelect);
      });

      it('should open the modal', () => {
        expect(jquerySpy.callCount).to.be.equal(1);
        expect(jquerySpy.args[0].length).to.be.equal(1);
        expect(jquerySpy.args[0][0]).to.be.equal(component.teamSettingsModal.nativeElement);
        expect(openModalSpy.callCount).to.be.equal(1);
        expect(openModalSpy.args[0]).to.be.length(1);
        expect(openModalSpy.args[0][0].complete).to.exist;
      });

      describe('reload', () => {

        beforeEach(() => {
          component.reload();
        });

        it('should set selectedTeam to null', () => {
          expect(component.selectedTeam).to.be.null;
        });

      });

      describe('close the modal', () => {

        beforeEach(() => {
          openModalSpy.args[0][0].complete();
        });

        it('should call zone.run()', () => {
          expect(zoneRunSpy.callCount).to.be.equal(1);
        });

      });

    });

  });

});
