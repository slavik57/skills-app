import {SkillSettingsComponent} from "../skillSettings/skillSettings.component";
import {UserService} from "../../../common/services/userService";
import {CreateSkillComponent} from "../createSkill/createSkill.component";
import {SkillService} from "../../../common/services/skillService";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'skills-settings',
  template: require('./skillsSettings.component.html'),
  styles: [require('./_skillsSettings.component.scss')],
  directives: [CircularLoadingComponent, CreateSkillComponent, SkillSettingsComponent]
})
export class SkillsSettingsComponent extends LoadingComponentBase<[ISkillNameDetails[], boolean]> {
  @ViewChild('skillSettingsModal') public skillSettingsModal: ElementRef;
  @ViewChild('creatingSkillModal') public creatingSkillModal: ElementRef;
  @ViewChild('deleteSkillModal') public deleteSkillModal: ElementRef;
  public isLoadingSkills: boolean;
  public loadingSkillsError: any;
  public skillsDetails: ISkillNameDetails[];
  public selectedSkill: ISkillNameDetails;
  public isCreatingSkill: boolean;
  public canUserModifySkills: boolean;
  public skillToDelete: ISkillNameDetails;
  public isDeletingSkill: boolean;
  public deletingSkillError: any;

  constructor(private skillService: SkillService,
    private userService: UserService,
    private zone: NgZone) {
    super();
  }

  public ngOnInit() {
    this.skillToDelete = null;
    this.isDeletingSkill = false;
    this.deletingSkillError = null;

    super.ngOnInit();
  }

  public selectSkill(skillDetails: ISkillNameDetails): void {
    this.selectedSkill = skillDetails;

    this._openModal(this.skillSettingsModal);
  }

  public deleteSkill(skillDetails: ISkillNameDetails): void {
    this.skillToDelete = skillDetails;

    this._openModal(this.deleteSkillModal, () => {
      this.skillToDelete = null;
    });
  }

  public confirmDeletingSkill(): void {
    this.isDeletingSkill = true;
    this.deletingSkillError = null;

    this.skillService.deleteSkill(this.skillToDelete.id)
      .finally(() => this._setAsNotDeletingSkill())
      .subscribe(() => this._onSkillDeletedSuccessfully(),
      (error) => this._setDeletingSkillError(error));
  }

  public setAsCreatingSkill(): void {
    this.isCreatingSkill = true;

    this._openModal(this.creatingSkillModal, () => {
      this.isCreatingSkill = false;
    });
  }

  public onSkillCreated(newSkillNameDetails: ISkillNameDetails): void {
    this._closeModal(this.creatingSkillModal);
    this.skillsDetails.unshift(newSkillNameDetails);
    this.selectSkill(newSkillNameDetails);
  }

  protected load(): void {
    this.selectedSkill = null;
    this.isCreatingSkill = false;
    super.load();
  }

  protected get(): Observable<[ISkillNameDetails[], boolean]> {
    return Observable.combineLatest(
      this.skillService.getSkillsDetails(),
      this.userService.canUserModifySkills()
    );
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingSkills = value;
  }

  protected setLoadingResult(result: [ISkillNameDetails[], boolean]): void {
    if (!result) {
      this.skillsDetails = null;
      this.canUserModifySkills = false;
      return;
    }

    this.skillsDetails = result[0];
    this.canUserModifySkills = result[1];
  }

  protected setLoadingError(error: any): void {
    this.loadingSkillsError = error;
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

  private _setAsNotDeletingSkill(): void {
    this.isDeletingSkill = false;
  }

  private _onSkillDeletedSuccessfully(): void {
    var skillToDeleteIndex = this.skillsDetails.indexOf(this.skillToDelete);
    this.skillsDetails.splice(skillToDeleteIndex, 1);

    this._closeModal(this.deleteSkillModal);
  }

  private _setDeletingSkillError(error: any): void {
    this.deletingSkillError = error;
  }

}
