import {IUserService} from '../../modules/common/services/userService';

export class UserServiceMockFactory {
  public static createUserServiceMock(): IUserService {
    return {
      signinUser: () => null,
      isUsernameExists: () => null,
      registerUser: () => null,
      getUserDetails: () => null,
      getUsersDetails: () => null,
      updateUserDetails: () => null,
      updateUserPassword: () => null,
      getUserPermissions: () => null
    }
  }
}
