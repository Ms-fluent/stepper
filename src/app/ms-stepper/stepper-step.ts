import {Directive, EmbeddedViewRef, Input, TemplateRef} from '@angular/core';

let _uniqueId = 0;

export class MsStepperStepContext {
  odd: boolean;
  even: boolean;
  first: boolean;
  last: boolean;

  constructor(public index: number, total: number) {
    this.odd = index % 2 === 1;
    this.even = !this.odd;
    this.first = index === 0;
    this.last = index === total - 1;
  }
}

@Directive({
  selector: '[ms-stepper-step], [msStepperStep]'
})
export class MsStepperStepDef {
  private _uniqueId = `ms-stepper-step-${_uniqueId++}`;
  _index: number;
  _viewRef: EmbeddedViewRef<MsStepperStepContext>;

  @Input()
  get label(): string {
    return this._label;
  }

  set label(value: string) {
    this._label = value;
  }

  private _label: string = this._uniqueId;

  @Input()
  ngIf: boolean;

  constructor(private _templateRef: TemplateRef<MsStepperStepContext>) {
  }

  get templateRef(): TemplateRef<MsStepperStepContext> {
    return this._templateRef;
  }

  get host(): HTMLElement {
    if (this._viewRef) {
      return this._viewRef.rootNodes[0];
    }
    return undefined;
  }
}
