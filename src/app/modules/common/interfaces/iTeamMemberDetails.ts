import {IUsernameDetails} from "./iUsernameDetails";

export interface ITeamMemberDetails extends IUsernameDetails {
  isAdmin: boolean;
}
