import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {TeamService} from "../../../common/services/teamService";
import {ITeamNameDetails} from "../../../common/interfaces/iTeamNameDetails";
import { Component, Input, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'team-settings',
  template: require('./teamSettings.component.html'),
  styles: [require('./teamSettings.component.scss')],
  directives: [
    CircularLoadingComponent
  ],
})
export class TeamSettingsComponent implements AfterViewInit, OnInit {
  @Input() public teamDetails: ITeamNameDetails;
  @ViewChild('availableTeamSettings') availableTeamSettings: ElementRef;

  constructor(private teamService: TeamService) {
  }

  public ngOnInit(): void {
  }

  public ngAfterViewInit(): void {
    $(this.availableTeamSettings.nativeElement).tabs();
  }

}
