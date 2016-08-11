import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {
  TeamUsersComponent,
  TeamUsersState
} from "./teamUsers.component";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {expect} from 'chai';

describe('TeamUsersComponent', () => {

  var teamDetails: ITeamNameDetails;
  var component: TeamUsersComponent;

  beforeEachProviders(() => {
    return [
      TeamUsersComponent
    ];
  });

  beforeEach(inject([TeamUsersComponent], (_component: TeamUsersComponent) => {
    component = _component;

    teamDetails = {
      id: 12334,
      teamName: 'some team name'
    };

    component.teamDetails = teamDetails;

    component.ngOnInit();
  }));

  it('TeamUsersState should be initialized correctly', () => {
    expect(component.TeamUsersState).to.be.equal(TeamUsersState);
  })

  it('state should be correct', () => {
    expect(component.state).to.be.equal(TeamUsersState.LIST_USERS);
  });

  describe('addTeamMember', () => {

    beforeEach(() => {
      component.addTeamMember();
    });

    it('should set state correctly', () => {
      expect(component.state).to.be.equal(TeamUsersState.ADD_TEAM_MEMBER);
    });

    describe('cancelAddingTeamMember', () => {

      beforeEach(() => {
        component.cancelAddingTeamMember();
      });

      it('should set state correctly', () => {
        expect(component.state).to.be.equal(TeamUsersState.LIST_USERS);
      });

    })

  });

});
