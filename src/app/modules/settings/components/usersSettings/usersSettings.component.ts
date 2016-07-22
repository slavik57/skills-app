import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {UserPermissionsSettingsComponent} from "../userPermissionsSettings/userPermissionsSettings.component";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UserService} from "../../../common/services/userService";
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'users-settings',
  template: require('./usersSettings.component.html'),
  styles: [require('./usersSettings.component.scss')],
  directives: [CircularLoadingComponent, UserPermissionsSettingsComponent]
})
export class UsersSettingsComponent extends LoadingComponentBase<IUsernameDetails[]> implements OnInit {
  public isLoadingUsers: boolean;
  public loadingUsersError: any;
  public usersDetails: IUsernameDetails[];
  public selectedUser: IUsernameDetails;
  @ViewChild('userSettingsModal') public userSettingsModal: ElementRef;

  constructor(private userService: UserService) {
    super();
  }

  public selectUser(userDetails: IUsernameDetails): void {
    this.selectedUser = userDetails;

    $(this.userSettingsModal.nativeElement).openModal();
  }

  protected load(): void {
    this.selectedUser = null;
    super.load();
  }

  protected get(): Observable<IUsernameDetails[]> {
    return this.userService.getUsersDetails();
  }

  protected setIsLoading(value: boolean): void {
    this.isLoadingUsers = value;
  }

  protected setLoadingResult(usersDetails: IUsernameDetails[]): void {
    this.usersDetails = usersDetails;
  }

  protected setLoadingError(error: any): void {
    this.loadingUsersError = error;
  }
}
