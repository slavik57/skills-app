import { Injectable } from '@angular/core';

export interface ILocationService {
  goToUrl(url: string): void;
}

@Injectable()
export class LocationService implements ILocationService {
  
  public goToUrl(url: string): void {
    window.location.href = url;
  }

}
