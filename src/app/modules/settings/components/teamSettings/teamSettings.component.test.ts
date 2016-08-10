import {TeamServiceMockFactory} from "../../../../testUtils/mockFactories/teamServiceMockFactory";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {provide} from '@angular/core';
import {SinonSpy, stub, spy} from 'sinon';
import {expect} from 'chai';
import { TeamSettingsComponent } from './teamSettings.component';
import {ITeamService, TeamService} from "../../../common/services/teamService";
import { Subject } from 'rxjs/Subject';

describe('TeamSettingsComponent', () => {

  var teamServiceMock: ITeamService;
  var teamDetails: ITeamNameDetails;

  var component: TeamSettingsComponent;

  beforeEachProviders(() => {

    teamServiceMock = TeamServiceMockFactory.createTeamServiceMock();

    return [
      provide(TeamService, { useValue: teamServiceMock }),
      TeamSettingsComponent
    ];
  });

  beforeEach(inject([TeamSettingsComponent], (_component: TeamSettingsComponent) => {
    component = _component;

    teamDetails = {
      id: 12321,
      teamName: 'some team name'
    };

    component.teamDetails = teamDetails;

    component.availableTeamSettings = {
      nativeElement: {}
    };

    component.ngOnInit();
  }));

  describe('ngAfterViewInit', () => {

    var jquerySpy: SinonSpy;
    var jqueryResultTabsSpy: SinonSpy;

    beforeEach(() => {
      var jqueryResult = {
        tabs: () => null
      }

      jqueryResultTabsSpy = spy(jqueryResult, 'tabs');

      jquerySpy = stub(window, '$', () => {
        return jqueryResult;
      });

      component.ngAfterViewInit();
    });

    afterEach(() => {
      jquerySpy.restore();
    });

    it('should initialize tabs', () => {
      expect(jquerySpy.callCount).to.be.equal(1);
      expect(jquerySpy.args[0]).to.be.length(1);
      expect(jquerySpy.args[0][0]).to.be.equal(component.availableTeamSettings.nativeElement);
      expect(jqueryResultTabsSpy.callCount).to.be.equal(1);
    });

  });

});
