import {UserServiceMockFactory} from "../../../../testUtils/mockFactories/userServiceMockFactory";
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
import {IUserService, UserService} from "../../../common/services/userService";
import {ITeamService, TeamService} from "../../../common/services/teamService";
import {SinonSpy, spy, stub} from 'sinon';
import { Subject } from 'rxjs/Subject';
import * as _ from 'lodash';

describe('TeamsSettingsComponent', () => {

  var teamServiceMock: ITeamService;
  var userServiceMock: IUserService;
  var getTeamsDetailsSpy: SinonSpy;
  var getCanUserModifyTeamsListSpy: SinonSpy;
  var getTeamsDetailsResult: Subject<ITeamNameDetails[]>;
  var getCanUserModifyTeamsListResult: Subject<boolean>;
  var zoneMock: NgZone;
  var zoneRunSpy: SinonSpy;

  var component: TeamsSettingsComponent;

  beforeEachProviders(() => {

    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();
    userServiceMock = UserServiceMockFactory.createUserServiceMock();

    getTeamsDetailsSpy =
      stub(teamServiceMock, 'getTeamsDetails', () => {
        getTeamsDetailsResult = new Subject<ITeamNameDetails[]>();
        return getTeamsDetailsResult;
      });

    getCanUserModifyTeamsListSpy =
      stub(userServiceMock, 'canUserModifyTeams', () => {
        getCanUserModifyTeamsListResult = new Subject<boolean>();
        return getCanUserModifyTeamsListResult;
      });

    zoneMock = <any>{
      run: () => null
    }

    zoneRunSpy = stub(zoneMock, 'run', (func) => func());

    return [
      provide(NgZone, { useValue: zoneMock }),
      provide(UserService, { useValue: userServiceMock }),
      provide(TeamService, { useValue: teamServiceMock }),
      TeamsSettingsComponent
    ];
  });

  beforeEach(inject([TeamsSettingsComponent], (_component: TeamsSettingsComponent) => {
    component = _component;

    component.teamSettingsModal = {
      nativeElement: {}
    }

    component.creatingTeamModal = {
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

  it('should call userService.canUserModifyTeams()', () => {
    expect(getCanUserModifyTeamsListSpy.callCount).to.be.equal(1);
  });

  it('teamsDetails should be null', () => {
    expect(component.teamsDetails).to.be.null;
  });

  it('selectedTeam should be null', () => {
    expect(component.selectedTeam).to.be.null;
  });

  it('isCreatingTeam should be false', () => {
    expect(component.isCreatingTeam).to.be.false;
  });

  it('canUserModifyTeams should be false', () => {
    expect(component.canUserModifyTeams).to.be.false;
  });

  var onOneError = (returnError: (error: string) => void) => {
    return () => {

      var error: string;

      beforeEach(() => {
        error = 'some error';
        returnError(error);
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

      it('isCreatingTeam should be false', () => {
        expect(component.isCreatingTeam).to.be.false;
      });

      it('canUserModifyTeams should be false', () => {
        expect(component.canUserModifyTeams).to.be.false;
      });

      describe('reload', () => {

        beforeEach(() => {
          getTeamsDetailsSpy.reset();
          getCanUserModifyTeamsListSpy.reset();

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

        it('should call userService.canUserModifyTeams()', () => {
          expect(getCanUserModifyTeamsListSpy.callCount).to.be.equal(1);
        });

        it('teamsDetails should be null', () => {
          expect(component.teamsDetails).to.be.null;
        });

        it('selectedTeam should be null', () => {
          expect(component.selectedTeam).to.be.null;
        });

        it('isCreatingTeam should be false', () => {
          expect(component.isCreatingTeam).to.be.false;
        });

        it('canUserModifyTeams should be false', () => {
          expect(component.canUserModifyTeams).to.be.false;
        });

      })

    }
  }

  describe('getting teams details fails',
    onOneError((error: string) => {
      getTeamsDetailsResult.error(error);

      getCanUserModifyTeamsListResult.next(true);
      getCanUserModifyTeamsListResult.complete();
    })
  );

  describe('getting can user modify teams list fails',
    onOneError((error: string) => {
      getCanUserModifyTeamsListResult.error(error);

      var teamsDetails: ITeamNameDetails[] =
        _.map([1, 2, 3], (_id) => {
          return { id: _id, teamName: _id.toString() };
        });

      getTeamsDetailsResult.next(teamsDetails);
      getTeamsDetailsResult.complete();
    })
  );

  describe('all succeeds', () => {

    var teamsDetails: ITeamNameDetails[];
    var canModifyTeams: boolean;

    beforeEach(() => {
      teamsDetails =
        _.map([1, 2, 3], (_id) => {
          return { id: _id, teamName: _id.toString() };
        });
      canModifyTeams = true;

      getTeamsDetailsResult.next(teamsDetails);
      getTeamsDetailsResult.complete();

      getCanUserModifyTeamsListResult.next(canModifyTeams);
      getCanUserModifyTeamsListResult.complete();

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

    it('isCreatingTeam should be false', () => {
      expect(component.isCreatingTeam).to.be.false;
    });

    it('canUserModifyTeams should be correct', () => {
      expect(component.canUserModifyTeams).to.be.equal(canModifyTeams);
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

      it('isCreatingTeam should be false', () => {
        expect(component.isCreatingTeam).to.be.false;
      });

      describe('reload', () => {

        beforeEach(() => {
          component.reload();
        });

        it('should set selectedTeam to null', () => {
          expect(component.selectedTeam).to.be.null;
        });

        it('isCreatingTeam should be false', () => {
          expect(component.isCreatingTeam).to.be.false;
        });

      });

      describe('close the modal', () => {

        beforeEach(() => {
          openModalSpy.args[0][0].complete();
        });

        it('should call zone.run()', () => {
          expect(zoneRunSpy.callCount).to.be.equal(1);
        });

        it('isCreatingTeam should be false', () => {
          expect(component.isCreatingTeam).to.be.false;
        });

      });

    });

    describe('setAsCreatingTeam', () => {

      var jquerySpy: SinonSpy;
      var openModalSpy: SinonSpy;
      var jqueryMock: any;

      beforeEach(() => {
        jqueryMock = {
          openModal: () => null
        }

        openModalSpy = spy(jqueryMock, 'openModal');

        jquerySpy = stub(window, '$', () => jqueryMock);

        component.setAsCreatingTeam();
      });

      afterEach(() => {
        jquerySpy.restore();
      });

      it('should set isCreatingTeam to true', () => {
        expect(component.isCreatingTeam).to.be.true;
      });

      it('should open the modal', () => {
        expect(jquerySpy.callCount).to.be.equal(1);
        expect(jquerySpy.args[0].length).to.be.equal(1);
        expect(jquerySpy.args[0][0]).to.be.equal(component.creatingTeamModal.nativeElement);
        expect(openModalSpy.callCount).to.be.equal(1);
        expect(openModalSpy.args[0]).to.be.length(1);
        expect(openModalSpy.args[0][0].complete).to.exist;
      });

      describe('close the modal', () => {

        beforeEach(() => {
          openModalSpy.args[0][0].complete();
        });

        it('should call zone.run()', () => {
          expect(zoneRunSpy.callCount).to.be.equal(1);
        });

        it('isCreatingTeam should be false', () => {
          expect(component.isCreatingTeam).to.be.false;
        });

      });

      describe('onTeamCreated', () => {

        var originalTeamsDetails: ITeamNameDetails[];
        var createdTeamDetails: ITeamNameDetails;
        var closeModalSpy: SinonSpy;

        beforeEach(() => {
          createdTeamDetails = {
            teamName: 'some new team name',
            id: 123123
          }

          jqueryMock.closeModal = () => {
            openModalSpy.args[0][0].complete();
          };

          closeModalSpy = spy(jqueryMock, 'closeModal');

          jquerySpy.reset();

          originalTeamsDetails =
            _.map(component.teamsDetails, _ => _);

          component.onTeamCreated(createdTeamDetails);
        })

        it('should close the modal', () => {
          expect(jquerySpy.callCount).to.be.equal(1);
          expect(jquerySpy.args[0].length).to.be.equal(1);
          expect(jquerySpy.args[0][0]).to.be.equal(component.creatingTeamModal.nativeElement);
          expect(closeModalSpy.callCount).to.be.equal(1);
        });

        it('should call zone.run()', () => {
          expect(zoneRunSpy.callCount).to.be.equal(1);
        });

        it('should set isCreatingTeam to false', () => {
          expect(component.isCreatingTeam).to.be.false;
        });

        it('should add the created team details to the teams details list', () => {
          expect(component.teamsDetails).to.be.length(originalTeamsDetails.length + 1);
        });

        it('should add the created team details as first team details', () => {
          expect(component.teamsDetails[0]).to.be.equal(createdTeamDetails);
        });

        it('should select the created team details', () => {
          expect(component.selectedTeam).to.be.equal(createdTeamDetails);
        });

        it('should open the selected team modal', () => {
          expect(jquerySpy.callCount).to.be.equal(1);
          expect(jquerySpy.args[0].length).to.be.equal(1);
          expect(jquerySpy.args[0][0]).to.be.equal(component.teamSettingsModal.nativeElement);
          expect(openModalSpy.callCount).to.be.equal(1);
          expect(openModalSpy.args[0]).to.be.length(1);
          expect(openModalSpy.args[0][0].complete).to.exist;
        });

      });
    });

  });

});
