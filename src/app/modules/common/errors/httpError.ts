import {StatusCode} from "../../../../common/statusCode";

export class HttpError extends Error {
  public status: StatusCode;
}
