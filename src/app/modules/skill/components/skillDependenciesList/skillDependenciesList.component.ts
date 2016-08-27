import {ISkillDependencyDetails} from "../../../common/interfaces/iSkillDependencyDetails";
import {SkillService} from "../../../common/services/skillService";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'skill-dependencies-list',
  template: require('./skillDependenciesList.component.html'),
  styles: [require('./_skillDependenciesList.component.scss')]
})
export class SkillDependenciesListComponent extends LoadingComponentBase<ISkillDependencyDetails[]> implements OnInit {
  @Input() public skillDetails: ISkillNameDetails;
  @Input() public canModify: boolean;
  @Output('skillDependencies') public skillDependenciesChangedEvent: EventEmitter<ISkillDependencyDetails[]>;
  @Output('changingSkillDependencies') public changingSkillDependenciesEvent: EventEmitter<boolean>;
  public isLoadingSkillDependencies: boolean;
  public loadingSkillDependenciesError: any;
  public skillDependencies: ISkillDependencyDetails[];
  public updatingSkillDependency: boolean;
  public updatingSkillDependencyError: any;

  constructor(private skillService: SkillService) {
    super();

    this.skillDependenciesChangedEvent = new EventEmitter<ISkillDependencyDetails[]>();
    this.changingSkillDependenciesEvent = new EventEmitter<boolean>();
    this.updatingSkillDependency = false;
    this.updatingSkillDependencyError = null;
  }

  public removeSkillDependency(skillDependency: ISkillDependencyDetails): void {
    this._setAsUpdatingSkillDependency();

    this.skillService.removeSkillDependency(this.skillDetails.id, skillDependency.id)
      .finally(() => this._changeUpdatingSkillDependency(false))
      .subscribe(
      () => this._removeSkillDependencyFromSkillDependenciesList(skillDependency),
      (_error) => this.updatingSkillDependencyError = _error);
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingSkillDependencies = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingSkillDependenciesError = error;
  }

  protected setLoadingResult(result: ISkillDependencyDetails[]): void {
    this._setSkillDependencies(result);
  }

  protected get(): Observable<ISkillDependencyDetails[]> {
    return this.skillService.getSkillDependencies(this.skillDetails.id);
  }

  private _setAsUpdatingSkillDependency(): void {
    this._changeUpdatingSkillDependency(true);
    this.updatingSkillDependencyError = null;
  }

  private _changeUpdatingSkillDependency(isUpdating: boolean): void {
    this.updatingSkillDependency = isUpdating;
    this.changingSkillDependenciesEvent.emit(isUpdating);
  }

  private _removeSkillDependencyFromSkillDependenciesList(skllDependency: ISkillDependencyDetails): void {
    var skillDependencyIndex: number = this.skillDependencies.indexOf(skllDependency);

    this.skillDependencies.splice(skillDependencyIndex, 1);

    this._setSkillDependencies(this.skillDependencies);
  }

  private _setSkillDependencies(skillDependencies: ISkillDependencyDetails[]): void {
    this.skillDependencies = skillDependencies;

    if (skillDependencies) {
      this.skillDependenciesChangedEvent.emit(skillDependencies);
    }
  }
}
