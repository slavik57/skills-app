import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {SkillService} from "../../../common/services/skillService";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import {ISkillExistsValidator, SkillExistsValidator, SkillExistsValidatorFactory} from "../../../common/validators/skillExistsValidator";

@Component({
  selector: 'create-skill',
  template: require('./createSkill.component.html'),
  styles: [require('./_createSkill.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent],
  providers: [FormBuilder, SkillExistsValidatorFactory]
})
export class CreateSkillComponent extends FormComponentBase implements OnInit, OnDestroy {
  @Output('onSkillCreated') public skillCreatedEvent: EventEmitter<ISkillNameDetails>;
  public submitting: boolean;
  public error: any;
  public createSkillFormGroup: FormGroup;
  public createSkillError: any;
  public creatingSkill: boolean;
  public isSkillCreated: boolean;
  public skillName: string;

  private _skillExistsValidator: ISkillExistsValidator;
  private _skillNameControl: AbstractControl;

  constructor(private skillService: SkillService,
    private formBuilder: FormBuilder,
    private skillExistsValidatorFactory: SkillExistsValidatorFactory) {
    super();

    this.skillCreatedEvent = new EventEmitter<ISkillNameDetails>();
  }

  public ngOnInit(): void {
    this.creatingSkill = false;
    this.isSkillCreated = false;

    this._initialize();
  }

  public ngOnDestroy(): void {
    this._skillExistsValidator.destroy();
  }

  public canCreateSkill(): boolean {
    return this.createSkillFormGroup.valid && !!this.skillName;
  }

  public createSkill(): void {
    this.creatingSkill = true;
    this.createSkillError = null;
    this.isSkillCreated = false;

    this.skillService.createSkill(this.skillName)
      .finally(() => this._setAsNotCreatingSkill())
      .subscribe(
      (skillDetails: ISkillNameDetails) => this._onSkillCreated(skillDetails),
      (error: any) => this._setCreateSkillError(error));
  }

  private _initialize(): void {
    this.skillName = '';
    this._initializeFormGroup();
    setTimeout(() => Materialize.updateTextFields(), 0);
  }

  private _initializeFormGroup(): void {
    this._skillExistsValidator =
      this.skillExistsValidatorFactory.create();

    this.createSkillFormGroup = this.formBuilder.group({
      skillName: [this.skillName, Validators.required, this._skillExistsValidator.isExists.bind(this._skillExistsValidator)],
    });

    this._skillNameControl = this.createSkillFormGroup.controls['skillName'];

    this._skillExistsValidator.bindControl(this._skillNameControl);
  }

  private _setAsNotCreatingSkill(): void {
    this.creatingSkill = false;
  }

  private _setCreateSkillError(error: any): void {
    this.createSkillError = error;
  }

  private _onSkillCreated(skillDetails: ISkillNameDetails): void {
    this.skillName = '';
    this.isSkillCreated = true;

    this.resetControlAsUntouchedAndNotDirty(this._skillNameControl);

    this.skillCreatedEvent.emit(skillDetails);

    setTimeout(() => Materialize.updateTextFields(), 0);
  }
}
