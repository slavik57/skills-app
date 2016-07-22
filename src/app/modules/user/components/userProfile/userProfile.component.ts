import {LoadingComponentBase} from "../../../common/components/loadingComponentBase/loadingComponentBase";
import {IUserDetails} from "../../../common/interfaces/iUserDetails";
import {CircularLoadingComponent} from "../../../common/components/circularLoading/circularLoading.component";
import {UserService} from "../../../common/services/userService";
import {ChangeUserPasswordComponent} from "../changeUserPassword/changeUserPassword.component";
import {EditUserDetailsComponent} from "../editUserDetails/editUserDetails.component";
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'user-profile',
  template: require('./userProfile.component.html'),
  styles: [require('./userProfile.component.scss')],
  directives: [EditUserDetailsComponent, ChangeUserPasswordComponent, CircularLoadingComponent],
})
export class UserProfileComponent extends LoadingComponentBase<IUserDetails> implements OnInit {
  public gettingUserDetails: boolean;
  public gettingUserDetailsError: any;
  public userDetails: IUserDetails;

  constructor(private userService: UserService) {
    super();
  }

  protected get(): Observable<IUserDetails> {
    return this.userService.getUserDetails();
  }

  protected setIsLoading(value: boolean): void {
    this.gettingUserDetails = value;
  }

  protected setLoadingResult(userDetails: IUserDetails): void {
    this.userDetails = userDetails;
  }

  protected setLoadingError(error: any): void {
    this.gettingUserDetailsError = error;
  }
}
