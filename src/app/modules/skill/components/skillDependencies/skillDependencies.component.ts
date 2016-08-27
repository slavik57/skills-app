import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {Component, Input, OnInit} from '@angular/core';

export enum SkillDependenciesState {
  LIST_DEPENDENCIES,
  ADD_DEPENDENCY
}

@Component({
  selector: 'skill-dependencies',
  template: require('./skillDependencies.component.html'),
  styles: [require('./_skillDependencies.component.scss')]
})
export class SkillDependenciesComponent implements OnInit {
  @Input() public skillDetails: ISkillNameDetails;
  @Input() public canModify: boolean;
  public state: SkillDependenciesState;
  public SkillDependenciesState: any;
  public changingSkillDependencies: boolean;

  public ngOnInit(): void {
    this.SkillDependenciesState = SkillDependenciesState;
    this.state = SkillDependenciesState.LIST_DEPENDENCIES;
  }

  public addDependency(): void {
    this.state = SkillDependenciesState.ADD_DEPENDENCY;
  }

  public cancelAddingDependency(): void {
    this.state = SkillDependenciesState.LIST_DEPENDENCIES;
  }
}
