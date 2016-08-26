import {UserService} from "../../../common/services/userService";
import {ITeamModificatioPermissions} from "../../../common/interfaces/iTeamModificationPermissions";
import {TeamUsersComponent} from "../../../team/components/teamUsers/teamUsers.component";
import {EditTeamDetailsComponent} from "../editTeamDetails/editTeamDetails.component";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import { Component, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'team-settings',
  template: require('./teamSettings.component.html'),
  styles: [require('./_teamSettings.component.scss')],
  directives: [
    EditTeamDetailsComponent,
    TeamUsersComponent,
    CircularLoadingComponent
  ],
})
export class TeamSettingsComponent extends LoadingComponentBase<ITeamModificatioPermissions> implements OnInit {
  @Input() public teamDetails: ITeamNameDetails;
  @ViewChild('availableTeamSettings') availableTeamSettings: ElementRef;
  public isLoadingPermissions: boolean;
  public permissions: ITeamModificatioPermissions;
  public loadingPermissionsError: any;

  constructor(private userService: UserService) {
    super();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingPermissions = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingPermissionsError = error;
  }

  protected setLoadingResult(result: ITeamModificatioPermissions): void {
    this.permissions = result;

    if (result) {
      setTimeout(() => {
        $(this.availableTeamSettings.nativeElement).tabs();
      }, 0);
    }
  }

  protected get(): Observable<ITeamModificatioPermissions> {
    return this.userService.getTeamModificationPermissions(this.teamDetails.id);
  }

}
