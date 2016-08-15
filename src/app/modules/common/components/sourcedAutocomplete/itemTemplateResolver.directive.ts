import {EmbeddedViewRef, ViewContainerRef, Directive, Input, TemplateRef} from '@angular/core';

@Directive({
  selector: '[itemTemplate]'
})
export class ItemTemplateResolver {
  @Input()
  public item: any;

  private _viewContainer: ViewContainerRef;

  constructor(_viewContainer: ViewContainerRef) {
    this._viewContainer = _viewContainer;
  }

  @Input()
  public set itemTemplate(templateRef: TemplateRef<any>) {
    var context = {
      item: this.item
    };

    var embeddedViewRef: EmbeddedViewRef<any> =
      this._viewContainer.createEmbeddedView(templateRef, context);
  }
}
