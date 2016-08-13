import {IUserService} from '../../modules/common/services/userService';

export class UserServiceMockFactory {
  public static createUserServiceMock(): IUserService {
    return {
      signinUser: () => null,
      isUsernameExists: () => null,
      registerUser: () => null,
      getUserDetails: () => null,
      getUsersDetails: () => null,
      getUsersDetailsByPartialUsername: () => null,
      updateUserDetails: () => null,
      updateUserPassword: () => null,
      getUserPermissions: () => null,
      getUserPermissionsModificationRules: () => null,
      updateUserPermissions: () => null,
      canUserUpdatePassword: () => null,
      canUserModifyTeams: () => null
    }
  }
}
