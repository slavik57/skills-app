import {AddTeamUserComponent} from "../addTeamUser/addTeamUser.component";
import {TeamUsersListComponent} from "../teamUsersList/teamUsersList.component";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import { Component, Input, OnInit } from '@angular/core';

export enum TeamUsersState {
  LIST_USERS,
  ADD_TEAM_MEMBER
}

@Component({
  selector: 'team-users',
  template: require('./teamUsers.component.html'),
  styles: [require('./_teamUsers.component.scss')],
  directives: [TeamUsersListComponent, AddTeamUserComponent]
})
export class TeamUsersComponent implements OnInit {
  @Input() public teamDetails: ITeamNameDetails;
  @Input() public canModifyUsers: boolean;
  @Input() public canModifyTeamAdmins: boolean;
  public state: TeamUsersState;
  public TeamUsersState: any;
  public changingTeamMember: boolean;

  public ngOnInit(): void {
    this.TeamUsersState = TeamUsersState;
    this.state = TeamUsersState.LIST_USERS;
  }

  public addTeamMember(): void {
    this.state = TeamUsersState.ADD_TEAM_MEMBER;
  }

  public cancelAddingTeamMember(): void {
    this.state = TeamUsersState.LIST_USERS;
  }

}
