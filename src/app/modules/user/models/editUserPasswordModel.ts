export class EditUserPasswordModel {
  constructor(public password: string = null,
    public newPassword: string = null,
    public newPasswordRepeated: string = null) {
  }
}
