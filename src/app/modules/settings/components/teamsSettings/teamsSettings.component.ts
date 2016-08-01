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
  directives: [CircularLoadingComponent/*, TeamSettingsComponent*/]
})
export class TeamsSettingsComponent extends LoadingComponentBase<ITeamNameDetails[]> {
  @ViewChild('teamSettingsModal') public teamSettingsModal: ElementRef;
  @ViewChild('creatingTeamModal') public creatingTeamModal: ElementRef;
  public isLoadingTeams: boolean;
  public loadingTeamsError: any;
  public teamsDetails: ITeamNameDetails[];
  public selectedTeam: ITeamNameDetails;
  public isCreatingTeam: boolean;

  constructor(private teamService: TeamService,
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

  protected load(): void {
    this.selectedTeam = null;
    this.isCreatingTeam = false;
    super.load();
  }

  protected get(): Observable<ITeamNameDetails[]> {
    return this.teamService.getTeamsDetails();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingTeams = value;
  }

  protected setLoadingResult(teamsDetails: ITeamNameDetails[]): void {
    this.teamsDetails = teamsDetails;
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

}
