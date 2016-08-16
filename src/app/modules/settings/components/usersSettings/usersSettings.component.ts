import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {UserSettingsComponent} from "../userSettings/userSettings.component";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import {UserService} from "../../../common/services/userService";
import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NgFor } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'users-settings',
  template: require('./usersSettings.component.html'),
  styles: [require('./_usersSettings.component.scss')],
  directives: [CircularLoadingComponent, UserSettingsComponent]
})
export class UsersSettingsComponent extends LoadingComponentBase<IUsernameDetails[]> {
  public isLoadingUsers: boolean;
  public loadingUsersError: any;
  public usersDetails: IUsernameDetails[];
  public selectedUser: IUsernameDetails;
  @ViewChild('userSettingsModal') public userSettingsModal: ElementRef;

  constructor(private userService: UserService,
    private zone: NgZone) {
    super();
  }

  public selectUser(userDetails: IUsernameDetails): void {
    this.selectedUser = userDetails;

    $(this.userSettingsModal.nativeElement).openModal({
      complete: () => {
        this.zone.run(() => { });
      }
    });
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
