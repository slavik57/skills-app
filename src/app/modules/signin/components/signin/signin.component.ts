import {FormComponentBase} from "../../../common/components/formComponentBase/formComponentBase";
import {LocationService} from "../../../common/services/locationService";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {UserService} from "../../../common/services/userService";
import {SigninModel} from "../../../models/signinModel";
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { NgClass }    from '@angular/common';

@Component({
  selector: 'signin',
  template: require('./signin.component.html'),
  styles: [require('./_signin.component.scss')],
  directives: [ROUTER_DIRECTIVES, NgClass, CircularLoadingComponent],
})
export class SigninComponent extends FormComponentBase {
  public error = null;
  public model = new SigninModel();

  public submitting = false;

  constructor(private userService: UserService,
    private locationService: LocationService) {
    super();
  }

  public onSubmit(): void {
    this.submitting = true;
    this.error = null;

    this.userService.signinUser(this.model.username, this.model.password)
      .subscribe(
      (_redirectLocation: string) => this._redirect(_redirectLocation),
      _error => this._finishSigninWithError(_error));
  }

  private _redirect(redirectPath: string): void {
    this.locationService.goToUrl(redirectPath);
  }

  private _finishSigninWithError(_error: any) {
    this._submitted();
    this.error = _error;
  }

  private _submitted(): void {
    this.submitting = false;
  }
}
