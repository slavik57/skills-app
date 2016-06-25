import {SigninModel} from "../../../models/signinModel";
import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';
import { NgForm, NgClass }    from '@angular/common';

@Component({
  selector: 'signin',
  template: require('./signin.component.html'),
  styles: [require('./_signin.component.scss')],
  directives: [ROUTER_DIRECTIVES, NgClass]
})

export class SigninComponent {
  public model = new SigninModel();

  public submitting = false;

  public onSubmit(): void {
    this.submitting = true;

    setTimeout(() => this.submitting = false, 2000);
  }
}
