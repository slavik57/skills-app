import {Observable} from 'rxjs/Observable';

export interface IItemsSource {
  getItems(text: string): Observable<any[]>;
  converItemToString(item: any): string;
}
