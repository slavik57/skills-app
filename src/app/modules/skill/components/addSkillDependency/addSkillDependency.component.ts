import {SkillService} from "../../../common/services/skillService";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {SourcedAutocompleteComponent} from "../../../common/components/sourcedAutocomplete/sourcedAutocomplete.component";
import {IItemsSource} from "../../../common/components/sourcedAutocomplete/iItemsSource";
import {ISkillDependencyDetails} from "../../../common/interfaces/iSkillDependencyDetails";
import {ISkillNameDetails} from "../../../common/interfaces/iSkillNameDetails";
import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {Component, OnInit, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {
  ISkillNotExistsValidator,
  SkillNotExistsValidator,
  SkillNotExistsValidatorFactory
} from "../../../common/validators/skillNotExistsValidator";

@Component({
  selector: 'add-skill-dependency',
  template: require('./addSkillDependency.component.html'),
  styles: [require('./_addSkillDependency.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, SourcedAutocompleteComponent, CircularLoadingComponent],
  providers: [FormBuilder, SkillNotExistsValidatorFactory]
})
export class AddSkillDependencyComponent extends FormComponentBase implements OnInit, OnDestroy {
  public static MAX_NUMBER_OF_SUGGESTED_SKILLS = 3;
  @Input('skillDetails') public skillDetails: ISkillNameDetails;
  @Output('skillDependencyAdded') skillDependencyAddedEvent: EventEmitter<ISkillDependencyDetails>;
  public skillsByPartialSkillNameSource: IItemsSource;
  public addSkillDependencyFormGroup: FormGroup;
  public skillNameControl: FormControl;
  public isAddingSkillDependency: boolean;
  public addSkillDependencyError: any;

  private _skillNotExistsValidator: ISkillNotExistsValidator;

  constructor(private skillService: SkillService,
    private formBuilder: FormBuilder,
    private skillNotExistsValidatorFactory: SkillNotExistsValidatorFactory) {
    super();

    this.skillDependencyAddedEvent = new EventEmitter<ISkillDependencyDetails>();
  }

  public ngOnInit() {
    this.skillsByPartialSkillNameSource = {
      getItems: (partialSkillName: string) => {
        return this.skillService.getSkillsDetailsByPartialSkillName(partialSkillName, AddSkillDependencyComponent.MAX_NUMBER_OF_SUGGESTED_SKILLS);
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

  public addSkillDependency(): void {
    this.isAddingSkillDependency = true;
    this.addSkillDependencyError = null;

    this.skillService.addSkillDependency(this.skillDetails.id, this.skillNameControl.value)
      .finally(() => this._setAsNotAddingSkillDependency())
      .subscribe(
      (skillDependencyDetails: ISkillDependencyDetails) => this._onSkillDependencyAdded(skillDependencyDetails),
      (error: any) => this._setAddSkillDependencyError(error));
  }

  public canAddSkillDependency(): boolean {
    return this.addSkillDependencyFormGroup.valid && !!this.skillNameControl.value;
  }

  private _initialize(): void {
    this.isAddingSkillDependency = false;

    this._initializeFormGroup();
  }

  private _initializeFormGroup(): void {
    this._skillNotExistsValidator =
      this.skillNotExistsValidatorFactory.create();

    this.addSkillDependencyFormGroup = this.formBuilder.group({
      skillNameControl: ['', Validators.required, this._skillNotExistsValidator.isExists.bind(this._skillNotExistsValidator)],
    });

    this.skillNameControl =
      <FormControl>this.addSkillDependencyFormGroup.controls['skillNameControl'];

    this._skillNotExistsValidator.bindControl(this.skillNameControl);
  }

  private _setAsNotAddingSkillDependency(): void {
    this.isAddingSkillDependency = false;
  }

  private _setAddSkillDependencyError(error: any): void {
    this.addSkillDependencyError = error;
  }

  private _onSkillDependencyAdded(skillDependencyDetails: ISkillDependencyDetails): void {
    this.skillNameControl.updateValue('');
    this.resetControlAsUntouchedAndNotDirty(this.skillNameControl);

    this.skillDependencyAddedEvent.emit(skillDependencyDetails);

    setTimeout(() => Materialize.updateTextFields(), 0);
  }
}
