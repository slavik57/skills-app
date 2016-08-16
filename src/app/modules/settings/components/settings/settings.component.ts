import {TeamsSettingsComponent} from "../teamsSettings/teamsSettings.component";
import {SkillsSettingsComponent} from "../skillsSettings/skillsSettings.component";
import {UsersSettingsComponent} from "../usersSettings/usersSettings.component";
import { ROUTER_DIRECTIVES } from '@angular/router';
import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'settings',
  template: require('./settings.component.html'),
  styles: [require('./_settings.component.scss')],
  directives: [ROUTER_DIRECTIVES],
  precompile: [UsersSettingsComponent, SkillsSettingsComponent, TeamsSettingsComponent]
})
export class SettingsComponent implements AfterViewInit {
  @ViewChild('availableSettings') availableSettings: ElementRef;

  public ngAfterViewInit(): void {
    $(this.availableSettings.nativeElement).tabs();
  }
}
