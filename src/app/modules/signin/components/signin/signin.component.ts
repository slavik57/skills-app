import {LocationService} from "../../../common/services/locationService";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {UserService} from "../../../common/services/userService";
import {SigninModel} from "../../../models/signinModel";
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { NgForm, NgClass }    from '@angular/common';

@Component({
  selector: 'signin',
  template: require('./signin.component.html'),
  styles: [require('./_signin.component.scss')],
  directives: [ROUTER_DIRECTIVES, NgClass, CircularLoadingComponent],
  providers: [UserService, LocationService]
})

export class SigninComponent {
  public error = null;
  public model = new SigninModel();

  public submitting = false;

  constructor(private userService: UserService,
    private locationService: LocationService) {
  }

  public onSubmit(): void {
    this.submitting = true;
    this.error = null;

    this.userService.signinUser(this.model.username, this.model.password)
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
