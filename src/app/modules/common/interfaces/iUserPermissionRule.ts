import {IUserPermission} from "./iUserPermission";

export interface IUserPermissionRule extends IUserPermission {
  allowedToChange: boolean;
}
