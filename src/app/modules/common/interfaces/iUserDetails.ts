import {IUsernameDetails} from "./iUsernameDetails";

export interface IUserDetails extends IUsernameDetails {
  email: string;
  firstName: string;
  lastName: string;
}
