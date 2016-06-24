import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'signin',
  template: require('./signin.component.html'),
  styles: [require('./_signin.component.scss')],
  directives: [ROUTER_DIRECTIVES]
})

export class SigninComponent {
}
