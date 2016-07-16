import { Component, Input, ViewChild } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'navigation-bar',
  template: require('./navigation.component.html'),
  styles: [require('./navigation.component.scss')],
  directives: [ROUTER_DIRECTIVES]
})

export class NavigationComponent {
  @Input() isUserLoggedIn: boolean = false;
}
