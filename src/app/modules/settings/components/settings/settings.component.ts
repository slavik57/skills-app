import {TeamsSettingsComponent} from "../teamsSettings/teamsSettings.component";
import {SkillsSettingsComponent} from "../skillsSettings/skillsSettings.component";
import {UsersSettingsComponent} from "../usersSettings/usersSettings.component";
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'settings',
  template: require('./settings.component.html'),
  styles: [require('./settings.component.scss')],
  directives: [ROUTER_DIRECTIVES],
  precompile: [UsersSettingsComponent, SkillsSettingsComponent, TeamsSettingsComponent]
})
export class SettingsComponent implements AfterViewChecked {
  @ViewChild('availableSettings') availableSettings: ElementRef;

  public ngAfterViewChecked(): void {
    // TODO: Use different tab system or solve the transitions correctly...
    $(this.availableSettings.nativeElement).tabs();
  }
}
