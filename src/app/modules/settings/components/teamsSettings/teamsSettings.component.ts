import {UserService} from "../../../common/services/userService";
import {CreateTeamComponent} from "../createTeam/createTeam.component";
import {TeamService} from "../../../common/services/teamService";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'teams-settings',
  template: require('./teamsSettings.component.html'),
  styles: [require('./teamsSettings.component.scss')],
  directives: [CircularLoadingComponent, CreateTeamComponent]
})
export class TeamsSettingsComponent extends LoadingComponentBase<[ITeamNameDetails[], boolean]> {
  @ViewChild('teamSettingsModal') public teamSettingsModal: ElementRef;
  @ViewChild('creatingTeamModal') public creatingTeamModal: ElementRef;
  public isLoadingTeams: boolean;
  public loadingTeamsError: any;
  public teamsDetails: ITeamNameDetails[];
  public selectedTeam: ITeamNameDetails;
  public isCreatingTeam: boolean;
  public canUserModifyTeams: boolean;

  constructor(private teamService: TeamService,
    private userService: UserService,
    private zone: NgZone) {
    super();
  }

  public selectTeam(teamDetails: ITeamNameDetails): void {
    this.selectedTeam = teamDetails;

    this._openModal(this.teamSettingsModal);
  }

  public setAsCreatingTeam(): void {
    this.isCreatingTeam = true;

    this._openModal(this.creatingTeamModal, () => {
      this.isCreatingTeam = false;
    });
  }

  public onTeamCreated(newTeamNameDetails: ITeamNameDetails): void {
    this._closeModal(this.creatingTeamModal);
    this.teamsDetails.unshift(newTeamNameDetails);
    this.selectTeam(newTeamNameDetails);
  }

  protected load(): void {
    this.selectedTeam = null;
    this.isCreatingTeam = false;
    super.load();
  }

  protected get(): Observable<[ITeamNameDetails[], boolean]> {
    return Observable.combineLatest(
      this.teamService.getTeamsDetails(),
      this.userService.canUserModifyTeams()
    );
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingTeams = value;
  }

  protected setLoadingResult(result: [ITeamNameDetails[], boolean]): void {
    if (!result) {
      this.teamsDetails = null;
      this.canUserModifyTeams = false;
      return;
    }

    this.teamsDetails = result[0];
    this.canUserModifyTeams = result[1];
  }

  protected setLoadingError(error: any): void {
    this.loadingTeamsError = error;
  }

  private _openModal(modalElement: ElementRef, closeCallback = () => { }): void {
    $(modalElement.nativeElement).openModal({
      complete: () => {
        this.zone.run(closeCallback);
      }
    });
  }

  private _closeModal(modalElement: ElementRef): void {
    $(modalElement.nativeElement).closeModal();
  }

}
