import {IUserDetails} from '../../common/services/userService';

export class EditUserProfile implements IUserDetails {
  constructor(public id: number,
    public username: string,
    public email: string,
    public firstName: string,
    public lastName: string) {
  }

  public static fromUserDetails(userDetails: IUserDetails): EditUserProfile {
    return new EditUserProfile(
      userDetails.id,
      userDetails.username,
      userDetails.email,
      userDetails.firstName,
      userDetails.lastName
    );
  }
}
