import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router-deprecated';

@Component({
  selector: 'register',
  template: require('./register.component.html'),
  styles: [require('./register.component.css')],
  directives: [ROUTER_DIRECTIVES]
})

export class RegisterComponent {
}
