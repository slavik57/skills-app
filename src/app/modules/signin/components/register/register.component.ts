import {LocationService} from "../../../common/services/locationService";
import {UserService} from "../../../common/services/userService";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {IUsernameExistsValidator, UsernameExistsValidator, UsernameExistsValidatorFactory} from "../../../common/validators/usernameExistsValidator";
import {EqualFieldsValidator} from "../../../common/validators/equalFieldsValidator";
import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {EmailValidator} from "../../../common/validators/emailValidator";
import {RegisterModel} from "../../../models/registerModel";
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { REACTIVE_FORM_DIRECTIVES, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'register',
  template: require('./register.component.html'),
  styles: [require('./_register.component.scss')],
  directives: [ROUTER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent],
  providers: [FormBuilder, UsernameExistsValidatorFactory]
})

export class RegisterComponent extends FormComponentBase {
  public error = undefined;
  public submitting = false;
  public model = new RegisterModel();
  public registerFormGroup: FormGroup;
  public passwordsGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private usernameExistsValidatorFactory: UsernameExistsValidatorFactory,
    private userService: UserService,
    private locationService: LocationService) {
    super();

    this.passwordsGroup = this.formBuilder.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required]
    }, {
        validator: EqualFieldsValidator.allFieldsEqual
      });

    var usernameExistsValidator: IUsernameExistsValidator =
      this.usernameExistsValidatorFactory.create();

    this.registerFormGroup = this.formBuilder.group({
      username: ['', Validators.required, usernameExistsValidator.usernameExists.bind(usernameExistsValidator)],
      firstName: ['', Validators.required],
      passwordsGroup: this.passwordsGroup,
      lastName: ['', Validators.required],
      email: ['', EmailValidator.mailFormat]
    });

    usernameExistsValidator.bindControl(<any>this.registerFormGroup.controls['username']);
  }

  public onSubmit(): void {
    this.submitting = true;
    this.error = null;

    this.userService.registerUser(this.model.username,
      this.model.password,
      this.model.email,
      this.model.firstName,
      this.model.lastName)
      .finally(() => this._submitted())
      .subscribe(
      (_redirectLocation: string) => this._redirect(_redirectLocation),
      _error => this._setError(_error));
  }

  private _redirect(redirectPath: string): void {
    this.locationService.goToUrl(redirectPath);
  }

  private _setError(_error: any) {
    this.error = _error;
  }

  private _submitted(): void {
    this.submitting = false;
  }
}
