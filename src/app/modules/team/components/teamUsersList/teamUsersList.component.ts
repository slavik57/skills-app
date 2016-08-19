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
  @Output('teamMembers') public teamMembersChangedEvent: EventEmitter<ITeamMemberDetails[]>;
  @Output('removingTeamMemberStateChanged') public removingTeamMemberStateChangedEvent: EventEmitter<boolean>;
  public isLoadingTeamMembers: boolean;
  public loadingTeamMembersError: any;
  public teamMembers: ITeamMemberDetails[];
  public removingTeamMember: boolean;
  public removingTeamMemberError: any;

  constructor(private teamService: TeamService) {
    super();

    this.teamMembersChangedEvent = new EventEmitter<ITeamMemberDetails[]>();
    this.removingTeamMemberStateChangedEvent = new EventEmitter<boolean>();
    this.removingTeamMember = false;
    this.removingTeamMemberError = null;
  }

  public removeTeamMember(teamMember: ITeamMemberDetails): void {
    this._setRemovingTeamMember(true);
    this.removingTeamMemberError = null;

    this.teamService.removeTeamMember(this.teamDetails.id, teamMember.id)
      .finally(() => this._setRemovingTeamMember(false))
      .subscribe(
      () => this._removeTeamMemberFromTeamMembersList(teamMember),
      (_error) => this.removingTeamMemberError = _error);
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
      this.teamMembersChangedEvent.emit(result);
    }
  }

  protected get(): Observable<ITeamMemberDetails[]> {
    return this.teamService.getTeamMembers(this.teamDetails.id);
  }

  private _setRemovingTeamMember(isRemoving: boolean): void {
    this.removingTeamMember = isRemoving;
    this.removingTeamMemberStateChangedEvent.emit(isRemoving);
  }

  private _removeTeamMemberFromTeamMembersList(teamMember: ITeamMemberDetails): void {
    var teamMemberIndex: number = this.teamMembers.indexOf(teamMember);

    this.teamMembers.splice(teamMemberIndex, 1);

    this.teamMembersChangedEvent.emit(this.teamMembers);
  }
}
