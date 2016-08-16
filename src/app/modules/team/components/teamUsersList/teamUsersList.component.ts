import {ITeamMemberDetails} from "../../../common/interfaces/iTeamMemberDetails";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {TeamService} from "../../../common/services/teamService";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'team-users-list',
  template: require('./teamUsersList.component.html'),
  styles: [require('./_teamUsersList.component.scss')],
  directives: [CircularLoadingComponent]
})
export class TeamUsersListComponent extends LoadingComponentBase<ITeamMemberDetails[]> implements OnInit {
  @Input() public teamDetails: ITeamNameDetails;
  @Output('teamMembers') public teamMembersChanged: EventEmitter<ITeamMemberDetails[]>;
  public isLoadingTeamMembers: boolean;
  public loadingTeamMembersError: any;
  public teamMembers: ITeamMemberDetails[];

  constructor(private teamService: TeamService) {
    super();

    this.teamMembersChanged = new EventEmitter<ITeamMemberDetails[]>();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingTeamMembers = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingTeamMembersError = error;
  }

  protected setLoadingResult(result: ITeamMemberDetails[]): void {
    this.teamMembers = result;

    if (result) {
      this.teamMembersChanged.emit(result);
    }
  }

  protected get(): Observable<ITeamMemberDetails[]> {
    return this.teamService.getTeamMembers(this.teamDetails.id);
  }
}
