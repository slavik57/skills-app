import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {TeamService} from "../../../common/services/teamService";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'team-users-list',
  template: require('./teamUsersList.component.html'),
  styles: [require('./teamUsersList.component.scss')],
  directives: [CircularLoadingComponent]
})
export class TeamUsersListComponent extends LoadingComponentBase<IUsernameDetails[]> implements OnInit {
  @Input() public teamDetails: ITeamNameDetails;
  @Output('teamMembers') public teamMembersChanged: EventEmitter<IUsernameDetails[]>;
  public isLoadingTeamMembers: boolean;
  public loadingTeamMembersError: any;
  public teamMembers: IUsernameDetails[];

  constructor(private teamService: TeamService) {
    super();

    this.teamMembersChanged = new EventEmitter<IUsernameDetails[]>();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingTeamMembers = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingTeamMembersError = error;
  }

  protected setLoadingResult(result: IUsernameDetails[]): void {
    this.teamMembers = result;

    if (result) {
      this.teamMembersChanged.emit(result);
    }
  }

  protected get(): Observable<IUsernameDetails[]> {
    return this.teamService.getTeamMembers(this.teamDetails.id);
  }
}
