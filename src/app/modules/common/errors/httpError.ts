import {StatusCode} from "../../../../common/statusCode";

export class HttpError extends Error {
  public status: StatusCode;
  public body: any;

  public json(): any {
    return this.body;
  }
}
