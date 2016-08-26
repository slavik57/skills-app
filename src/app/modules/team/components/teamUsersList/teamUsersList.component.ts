import {ITeamMemberDetails} from "../../../common/interfaces/iTeamMemberDetails";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {TeamService} from "../../../common/services/teamService";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'team-users-list',
  template: require('./teamUsersList.component.html'),
  styles: [require('./_teamUsersList.component.scss')],
  directives: [CircularLoadingComponent]
})
export class TeamUsersListComponent extends LoadingComponentBase<ITeamMemberDetails[]> implements OnInit {
  @Input() public teamDetails: ITeamNameDetails;
  @Input() public canModifyUsers: boolean;
  @Input() public canModifyTeamAdmins: boolean;
  @Output('teamMembers') public teamMembersChangedEvent: EventEmitter<ITeamMemberDetails[]>;
  @Output('changingTeamMember') public changingTeamMemberEvent: EventEmitter<boolean>;
  @ViewChild('teamMembersList') public teamMembersListElement: ElementRef;
  public isLoadingTeamMembers: boolean;
  public loadingTeamMembersError: any;
  public teamMembers: ITeamMemberDetails[];
  public updatingTeamMember: boolean;
  public updatingTeamMemberError: any;

  constructor(private teamService: TeamService) {
    super();

    this.teamMembersChangedEvent = new EventEmitter<ITeamMemberDetails[]>();
    this.changingTeamMemberEvent = new EventEmitter<boolean>();
    this.updatingTeamMember = false;
    this.updatingTeamMemberError = null;
  }

  public removeTeamMember(teamMember: ITeamMemberDetails): void {
    this._setAsUpdatingTeamMember();

    this.teamService.removeTeamMember(this.teamDetails.id, teamMember.id)
      .finally(() => this._changeUpdatingTeamMember(false))
      .subscribe(
      () => this._removeTeamMemberFromTeamMembersList(teamMember),
      (_error) => this.updatingTeamMemberError = _error);
  }

  public changeTeamAdminRights(teamMember: ITeamMemberDetails, isAdmin: boolean): void {
    if (teamMember.isAdmin === isAdmin) {
      return;
    }

    this._setAsUpdatingTeamMember();
    teamMember.isAdmin = isAdmin;

    this.teamService.changeTeamAdminRights(this.teamDetails.id, teamMember.id, isAdmin)
      .finally(() => this._changeUpdatingTeamMember(false))
      .subscribe(
      () => this._updateTeamMemberAdminRights(teamMember, isAdmin),
      (_error) => this._handleUpdatingTeamMemberAdminRightsFailed(teamMember, _error, !isAdmin));
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingTeamMembers = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingTeamMembersError = error;
  }

  protected setLoadingResult(result: ITeamMemberDetails[]): void {
    this._setTeamMembers(result);
  }

  protected get(): Observable<ITeamMemberDetails[]> {
    return this.teamService.getTeamMembers(this.teamDetails.id);
  }

  private _setAsUpdatingTeamMember(): void {
    this._changeUpdatingTeamMember(true);
    this.updatingTeamMemberError = null;
  }

  private _changeUpdatingTeamMember(isUpdating: boolean): void {
    this.updatingTeamMember = isUpdating;
    this.changingTeamMemberEvent.emit(isUpdating);
  }

  private _removeTeamMemberFromTeamMembersList(teamMember: ITeamMemberDetails): void {
    var teamMemberIndex: number = this.teamMembers.indexOf(teamMember);

    this.teamMembers.splice(teamMemberIndex, 1);

    this._setTeamMembers(this.teamMembers);
  }

  private _setTeamMembers(teamMembers: ITeamMemberDetails[]): void {
    this.teamMembers = teamMembers;

    if (teamMembers) {
      this.teamMembersChangedEvent.emit(teamMembers);

      setTimeout(() => {
        $(this.teamMembersListElement.nativeElement).collapsible({
          accordion: true
        });
      }, 0);
    }
  }

  private _handleUpdatingTeamMemberAdminRightsFailed(teamMember: ITeamMemberDetails, error: any, originalIsAdmin: boolean): void {
    this.updatingTeamMemberError = error;
    this._updateTeamMemberAdminRights(teamMember, originalIsAdmin);
  }

  private _updateTeamMemberAdminRights(teamMember: ITeamMemberDetails, isAdmin: boolean): void {
    teamMember.isAdmin = isAdmin;
  }
}
