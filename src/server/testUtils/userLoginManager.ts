import {SuperTest} from 'supertest';

export class UserLoginManager {
  public static loginUser(server: SuperTest): Promise<void> {
    return new Promise((resolveCallback: (value?: void) => void) => {
      server.post('/login')
        .send({ username: 'some user', password: 'some password' })
        .end(() => resolveCallback());
    });
  }

  public static logoutUser(server: SuperTest): Promise<void> {
    return new Promise((resolveCallback: (value?: void) => void) => {
      server.get('/logout')
        .end(() => resolveCallback());
    });
  }
}
