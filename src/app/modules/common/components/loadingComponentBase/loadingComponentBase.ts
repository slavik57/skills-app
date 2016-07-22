import {UserService} from "../../../common/services/userService";
import {IUsernameDetails} from "../../../common/interfaces/iUsernameDetails";
import { OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export abstract class LoadingComponentBase<T> implements OnInit {
  public ngOnInit(): void {
    this._load();
  }

  public reload(): void {
    this._load();
  }

  private _load(): void {
    this.setIsLoading(true);
    this.setLoadingError(null);
    this.setLoadingResult(null);

    this.get()
      .finally(() => this.setIsLoading(false))
      .subscribe((_result: T) => this.setLoadingResult(_result),
      (_error: any) => this.setLoadingError(_error));
  }

  protected abstract setIsLoading(value: boolean): void;
  protected abstract setLoadingError(error: any): void;
  protected abstract setLoadingResult(result: T): void;
  protected abstract get(): Observable<T>;

}
