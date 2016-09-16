import {SkillService} from "../../../common/services/skillService";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {ISkillPrerequisiteDetails} from "../../../common/interfaces/ISkillPrerequisiteDetails";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'skill-prerequisites-list',
  template: require('./skillPrerequisitesList.component.html'),
  styles: [require('./_skillPrerequisitesList.component.scss')]
})
export class SkillPrerequisitesListComponent extends LoadingComponentBase<ISkillPrerequisiteDetails[]> implements OnInit {
  @Input() public skillDetails: ISkillNameDetails;
  @Input() public canModify: boolean;
  @Output('skillPrerequisites') public skillPrerequisitesChangedEvent: EventEmitter<ISkillPrerequisiteDetails[]>;
  @Output('changingSkillPrerequisites') public changingSkillPrerequisitesEvent: EventEmitter<boolean>;
  public isLoadingSkillPrerequisites: boolean;
  public loadingSkillPrerequisitesError: any;
  public skillPrerequisites: ISkillPrerequisiteDetails[];
  public updatingSkillPrerequisite: boolean;
  public updatingSkillPrerequisiteError: any;

  constructor(private skillService: SkillService) {
    super();

    this.skillPrerequisitesChangedEvent = new EventEmitter<ISkillPrerequisiteDetails[]>();
    this.changingSkillPrerequisitesEvent = new EventEmitter<boolean>();
    this.updatingSkillPrerequisite = false;
    this.updatingSkillPrerequisiteError = null;
  }

  public removeSkillPrerequisite(skillPrerequisite: ISkillPrerequisiteDetails): void {
    this._setAsUpdatingSkillPrerequisite();

    this.skillService.removeSkillPrerequisite(this.skillDetails.id, skillPrerequisite.id)
      .finally(() => this._changeUpdatingSkillPrerequisite(false))
      .subscribe(
      () => this._removeSkillPrerequisiteFromSkillPrerequisitesList(skillPrerequisite),
      (_error) => this.updatingSkillPrerequisiteError = _error);
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingSkillPrerequisites = value;
  }

  protected setLoadingError(error: any): void {
    this.loadingSkillPrerequisitesError = error;
  }

  protected setLoadingResult(result: ISkillPrerequisiteDetails[]): void {
    this._setSkillPrerequisites(result);
  }

  protected get(): Observable<ISkillPrerequisiteDetails[]> {
    return this.skillService.getSkillPrerequisites(this.skillDetails.id);
  }

  private _setAsUpdatingSkillPrerequisite(): void {
    this._changeUpdatingSkillPrerequisite(true);
    this.updatingSkillPrerequisiteError = null;
  }

  private _changeUpdatingSkillPrerequisite(isUpdating: boolean): void {
    this.updatingSkillPrerequisite = isUpdating;
    this.changingSkillPrerequisitesEvent.emit(isUpdating);
  }

  private _removeSkillPrerequisiteFromSkillPrerequisitesList(skllPrerequisite: ISkillPrerequisiteDetails): void {
    var skillPrerequisiteIndex: number = this.skillPrerequisites.indexOf(skllPrerequisite);

    this.skillPrerequisites.splice(skillPrerequisiteIndex, 1);

    this._setSkillPrerequisites(this.skillPrerequisites);
  }

  private _setSkillPrerequisites(skillPrerequisites: ISkillPrerequisiteDetails[]): void {
    this.skillPrerequisites = skillPrerequisites;

    if (skillPrerequisites) {
      this.skillPrerequisitesChangedEvent.emit(skillPrerequisites);
    }
  }
}
