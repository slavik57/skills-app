import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {Component, OnInit, Input} from '@angular/core';

export enum SkillPrerequisitesState {
  LIST_PREREQUISITES,
  ADD_PREREQUISITE
}

@Component({
  selector: 'skill-prerequisites',
  template: require('./skillPrerequisites.component.html'),
  styles: [require('./_skillPrerequisites.component.scss')]
})
export class SkillPrerequisitesComponent implements OnInit {
  @Input() public skillDetails: ISkillNameDetails;
  @Input() public canModify: boolean;
  public state: SkillPrerequisitesState;
  public SkillPrerequisitesState: any;
  public changingSkillPrerequisites: boolean;

  public ngOnInit(): void {
    this.SkillPrerequisitesState = SkillPrerequisitesState;
    this.state = SkillPrerequisitesState.LIST_PREREQUISITES;
  }

  public addPrerequisite(): void {
    this.state = SkillPrerequisitesState.ADD_PREREQUISITE;
  }

  public cancelAddingPrerequisite(): void {
    this.state = SkillPrerequisitesState.LIST_PREREQUISITES;
  }
}
