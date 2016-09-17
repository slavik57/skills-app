import {SkillService} from "../../../common/services/skillService";
import {ISkillPrerequisiteDetails} from "../../../common/interfaces/ISkillPrerequisiteDetails";
import {IItemsSource} from "../../../common/components/sourcedAutocomplete/iItemsSource";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {SourcedAutocompleteComponent} from "../../../common/components/sourcedAutocomplete/sourcedAutocomplete.component";
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {
  ISkillNotExistsValidator,
  SkillNotExistsValidator,
  SkillNotExistsValidatorFactory
} from "../../../common/validators/skillNotExistsValidator";

@Component({
  selector: 'add-skill-prerequisite',
  template: require('./addSkillPrerequisite.component.html'),
  styles: [require('./_addSkillPrerequisite.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, SourcedAutocompleteComponent, CircularLoadingComponent],
  providers: [FormBuilder, SkillNotExistsValidatorFactory]
})
export class AddSkillPrerequisiteComponent extends FormComponentBase implements OnInit, OnDestroy {
  public static MAX_NUMBER_OF_SUGGESTED_SKILLS = 3;
  @Input('skillDetails') public skillDetails: ISkillNameDetails;
  @Output('skillPrerequisiteAdded') skillPrerequisiteAddedEvent: EventEmitter<ISkillPrerequisiteDetails>;
  public skillsByPartialSkillNameSource: IItemsSource;
  public addSkillPrerequisiteFormGroup: FormGroup;
  public skillNameControl: FormControl;
  public isAddingSkillPrerequisite: boolean;
  public addSkillPrerequisiteError: any;

  private _skillNotExistsValidator: ISkillNotExistsValidator;

  constructor(private skillService: SkillService,
    private formBuilder: FormBuilder,
    private skillNotExistsValidatorFactory: SkillNotExistsValidatorFactory) {
    super();

    this.skillPrerequisiteAddedEvent = new EventEmitter<ISkillPrerequisiteDetails>();
  }

  public ngOnInit() {
    this.skillsByPartialSkillNameSource = {
      getItems: (partialSkillName: string) => {
        return this.skillService.getSkillsDetailsByPartialSkillName(partialSkillName, AddSkillPrerequisiteComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS);
      },
      converItemToString: (_skillDetails: ISkillNameDetails) => {
        return _skillDetails.skillName;
      }
    }

    this._initialize();
  }

  public ngOnDestroy(): void {
    this._skillNotExistsValidator.destroy();
  }

  public addSkillPrerequisite(): void {
    this.isAddingSkillPrerequisite = true;
    this.addSkillPrerequisiteError = null;

    this.skillService.addSkillPrerequisite(this.skillDetails.id, this.skillNameControl.value)
      .finally(() => this._setAsNotAddingSkillPrerequisite())
      .subscribe(
      (skillPrerequisiteDetails: ISkillPrerequisiteDetails) => this._onSkillPrerequisiteAdded(skillPrerequisiteDetails),
      (error: any) => this._setAddSkillPrerequisiteError(error));
  }

  public canAddSkillPrerequisite(): boolean {
    return this.addSkillPrerequisiteFormGroup.valid && !!this.skillNameControl.value;
  }

  private _initialize(): void {
    this.isAddingSkillPrerequisite = false;

    this._initializeFormGroup();
  }

  private _initializeFormGroup(): void {
    this._skillNotExistsValidator =
      this.skillNotExistsValidatorFactory.create();

    this.addSkillPrerequisiteFormGroup = this.formBuilder.group({
      skillNameControl: ['', Validators.required, this._skillNotExistsValidator.isExists.bind(this._skillNotExistsValidator)],
    });

    this.skillNameControl =
      <FormControl>this.addSkillPrerequisiteFormGroup.controls['skillNameControl'];

    this._skillNotExistsValidator.bindControl(this.skillNameControl);
  }

  private _setAsNotAddingSkillPrerequisite(): void {
    this.isAddingSkillPrerequisite = false;
  }

  private _setAddSkillPrerequisiteError(error: any): void {
    this.addSkillPrerequisiteError = error;
  }

  private _onSkillPrerequisiteAdded(skillPrerequisiteDetails: ISkillPrerequisiteDetails): void {
    this.skillNameControl.updateValue('');
    this.resetControlAsUntouchedAndNotDirty(this.skillNameControl);

    this.skillPrerequisiteAddedEvent.emit(skillPrerequisiteDetails);

    setTimeout(() => Materialize.updateTextFields(), 0);
  }
}
