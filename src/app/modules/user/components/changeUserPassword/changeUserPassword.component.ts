import {IUserDetails} from "../../../common/interfaces/iUserDetails";
import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {EqualFieldsValidator} from "../../../common/validators/equalFieldsValidator";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {EditUserPasswordModel} from "../../models/editUserPasswordModel";
import { Component, OnInit, Input } from '@angular/core';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import {UserService} from "../../../common/services/userService";

@Component({
  selector: 'change-user-password',
  template: require('./changeUserPassword.component.html'),
  styles: [require('./changeUserPassword.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent],
  providers: [FormBuilder]
})
export class ChangeUserPasswordComponent extends FormComponentBase implements OnInit {
  @Input() public userDetails: IUserDetails;
  public model: EditUserPasswordModel;
  public newPasswordsGroup: FormGroup;
  public userPasswordFormGroup: FormGroup;
  public updateUserPasswordError: any;
  public isPasswordUpdated: boolean;
  public isUpdatingPassword: boolean;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService) {
    super();
  }

  public ngOnInit(): void {
    if (!this.userDetails) {
      throw 'userDetails is not set';
    }

    this.isPasswordUpdated = false;
    this.isUpdatingPassword = false;

    this._createEmptyModel();
    this._createEmptyForm();
  }

  public changeUserPassword(): void {
    this.updateUserPasswordError = null;
    this.isUpdatingPassword = true;
    this.isPasswordUpdated = false;

    this.userService.updateUserPassword(this.userDetails.id, this.model.password, this.model.newPassword)
      .finally(() => this._setAsFinishedUpdatingPassword())
      .subscribe(() => this._setAsPasswordUpdated(),
      (error: any) => this._setUpdatingUserDetailsError(error));
  }

  private _createEmptyModel(): void {
    this.model = new EditUserPasswordModel();
  }

  private _createEmptyForm(): void {
    this.newPasswordsGroup = this.formBuilder.group({
      newPassword: ['', Validators.required],
      newPasswordRepeated: ['', Validators.required]
    }, {
        validator: EqualFieldsValidator.allFieldsEqual
      });

    this.userPasswordFormGroup = this.formBuilder.group({
      password: ['', Validators.required],
      newPasswordsGroup: this.newPasswordsGroup
    });
  }

  private _setAsFinishedUpdatingPassword(): void {
    this.isUpdatingPassword = false;
  }

  private _setAsPasswordUpdated(): void {
    this.isPasswordUpdated = true;

    this.model.password = '';
    this.model.newPassword = '';
    this.model.newPasswordRepeated = '';

    this.resetControlAsUntouchedAndNotDirty(this.userPasswordFormGroup.controls['password']);
    this.resetControlAsUntouchedAndNotDirty(this.newPasswordsGroup.controls['newPassword']);
    this.resetControlAsUntouchedAndNotDirty(this.newPasswordsGroup.controls['newPasswordRepeated']);

    setTimeout(() => Materialize.updateTextFields(), 0);
  }

  private _setUpdatingUserDetailsError(error: any): void {
    this.updateUserPasswordError = error;
  }
}
