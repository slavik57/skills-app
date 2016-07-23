import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {
  UserPermissionsSettingsComponent,
  UserPermissionsSettingsState
} from "./userPermissionsSettings.component";
import {
  it,
  inject,
  describe,
  beforeEach,
  beforeEachProviders,
} from '@angular/core/testing';
import {expect} from 'chai';

describe('UsersSettingsComponent', () => {

  var userDetails: IUsernameDetails;
  var component: UserPermissionsSettingsComponent;

  beforeEachProviders(() => {
    return [
      UserPermissionsSettingsComponent
    ];
  });

  beforeEach(inject([UserPermissionsSettingsComponent], (_component: UserPermissionsSettingsComponent) => {
    component = _component;

    userDetails = {
      id: 12321,
      username: 'some username'
    };

    component.userDetails = userDetails;

    component.ngOnInit();
  }));

  it('UserPermissionsSettingsState should be initialized correctly', () => {
    expect(component.UserPermissionsSettingsState).to.be.equal(UserPermissionsSettingsState);
  })

  it('state should be correct', () => {
    expect(component.state).to.be.equal(UserPermissionsSettingsState.READONLY);
  });

});
