import {CircularLoadingComponent} from "../circularLoading/circularLoading.component";
import {Component, Input, OnInit, TemplateRef, ContentChild} from '@angular/core';
import {REACTIVE_FORM_DIRECTIVES, FormControl} from '@angular/forms';
import {IItemsSource} from './iItemsSource';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

@Component({
  selector: 'sourced-autocomplete',
  template: require('./sourcedAutocomplete.component.html'),
  styles: [require('./sourcedAutocomplete.component.scss')],
  directives: [REACTIVE_FORM_DIRECTIVES, CircularLoadingComponent]
})
export class SourcedAutocompleteComponent implements OnInit {
  public static INSTANCE_NUMBER = 0;
  public static ID_PREFIX = 'sourced-autocomplete';

  @Input('autocompleteFormControl') public formControl: FormControl;
  @Input('labelText') public labelText: string;
  @Input('debounceTime') public debounceTime: string;
  @Input('itemsSource') public itemsSource: IItemsSource;

  @ContentChild(TemplateRef)
  public template: TemplateRef<any>;

  public id: string;
  public results: any[];
  public isLoadingResults: boolean;

  constructor() {
    this._initializeId();
  }

  public ngOnInit(): void {
    this._validateInputs();

    var debounceTime: number = this._getDebounceTime();

    this.isLoadingResults = false;
    this.results = null;

    this.formControl.valueChanges
      .debounceTime(debounceTime)
      .distinctUntilChanged()
      .switchMap((_searchText: string) => {
        this.isLoadingResults = true;
        return this._getItemsSafe(_searchText);
      })
      .subscribe((_results: any[]) => {
        this.isLoadingResults = false;
        this.results = _results;
      });
  }

  private _validateInputs(): void {
    if (!this.itemsSource) {
      throw 'items source is not supplied. Use itemsSource attribute.'
    }

    if (!this.formControl) {
      throw 'form control is not supplied. Use formControl attribute.'
    }
  }

  private _initializeId(): void {
    this.id =
      SourcedAutocompleteComponent.ID_PREFIX + SourcedAutocompleteComponent.INSTANCE_NUMBER;

    SourcedAutocompleteComponent.INSTANCE_NUMBER++;
  }

  private _getDebounceTime(): number {
    var debounceTime = Number(this.debounceTime);

    if (isNaN(debounceTime)) {
      debounceTime = 0;
    }

    return debounceTime;
  }

  private _getItemsSafe(searchText: string): Observable<any[]> {
    return new Observable<any[]>((_subscriber: Subscriber<any[]>) => {
      if (!searchText) {
        this._resolveItems(_subscriber, null);
        return;
      }

      this.itemsSource.getItems(searchText)
        .subscribe((_items: any[]) => {
          this._resolveItems(_subscriber, _items);
        }, (_error: any) => {
          this._resolveItems(_subscriber, null);
        });
    });
  }

  private _resolveItems(subscriber: Subscriber<any[]>, items: any[]): void {
    subscriber.next(items);
    subscriber.complete();
  }
}
