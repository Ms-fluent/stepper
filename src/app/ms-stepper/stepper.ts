import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MsStepperStepContext, MsStepperStepDef} from './stepper-step';


@Component({
  templateUrl: 'stepper.html',
  styleUrls: ['stepper.scss'],
  selector: 'ms-stepper, msStepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'ms-stepper'
  }
})
export class MsStepper implements AfterContentInit, AfterViewInit {
  private _initialized: boolean = false;
  private _activeStepDef: MsStepperStepDef;
  private _translateX: number = 0;

  _actualHeight: number;

  @Input()
  get activeLabel(): string {
    return this._activeLabel;
  }

  set activeLabel(label: string) {
    if (this._initialized) {
      this.activateLabel(label);
    } else {
      this._activeLabel = label;
    }
  }

  private _activeLabel: string;

  @Input()
  get activeIndex(): number {
    return this._activeIndex;
  }

  set activeIndex(index: number) {
    if (this._initialized) {
      this.activateIndex(index);
    } else {
      this._activeIndex = index;
    }
  }

  private _activeIndex: number;

  @Output()
  stepChange: EventEmitter<MsStepperStepDef> = new EventEmitter<MsStepperStepDef>();


  @ContentChildren(forwardRef(() => MsStepperStepDef), {descendants: true})
  _stepDefs: QueryList<MsStepperStepDef>;

  @ViewChildren('element', {read: ViewContainerRef})
  containers: QueryList<ViewContainerRef>;

  @ViewChild('stepperLayout')
  private _layout: ElementRef<HTMLDivElement>;



  private observer = new ResizeObserver(entries => {
    this._elementRef.nativeElement.style.height = entries[0].contentRect.height + 'px';
  });

  constructor(private _changeDetector: ChangeDetectorRef, private _elementRef: ElementRef<HTMLElement>) {

  }

  ngAfterViewInit(): void {
    this._stepDefs.forEach((step, i) => step._index = i);
    const stepDef = this._getInitialActiveStep();

    const width = this._elementRef.nativeElement.getBoundingClientRect().width;

    this._layout.nativeElement.style.width = (width * this._stepDefs.length) + 'px';

    this.activeStep(stepDef);
  }

  ngAfterContentInit(): void {
  }

  async activeStep(stepDef: MsStepperStepDef) {
    if (!stepDef) {
      throw new Error('Cannot active a undefined step');
    }
    const context = new MsStepperStepContext(stepDef._index, this._stepDefs.length);

    if (!stepDef._viewRef) {
      stepDef._viewRef = this.containers.toArray()[stepDef._index].createEmbeddedView(stepDef.templateRef, context);
      stepDef.host.className = `ms-stepper-step ms-stepper-step-${stepDef._index}`;
      stepDef._viewRef.detectChanges();
    }
    stepDef.host.style.width = this.width + 'px';

    this._actualHeight = stepDef.host.offsetHeight;
    this._elementRef.nativeElement.style.height = this._actualHeight + 'px';

    if(this._activeStepDef) {
      this.observer.unobserve(this._activeStepDef.host);
    }
    this.observer.observe(stepDef.host);

    this._activeLabel = stepDef.label;
    this._activeIndex = stepDef._index;

    await this._animate(stepDef);

    this._activeStepDef = stepDef;
    this.stepChange.emit(stepDef);
  }


  private _animate(stepDef: MsStepperStepDef): Promise<void> {
    const x = -this.width * stepDef._index;

    return new Promise<void>(resolve => {
      this._layout.nativeElement.animate([
        {transform: `translateX(${this._translateX}px)`},
        {transform: `translateX(${x}px)`}
      ], {fill: 'both', easing: 'ease-in-out', duration: 200})
        .onfinish = () => {
        this._translateX = x;
        resolve();
      };
    });

  }

  activateLabel(label: string) {
    const stepDef = this._getStepWithLabel(label);
    this.activeStep(stepDef);
  }

  activateIndex(index: number) {
    const stepDef = this._getStepAtIndexOf(index);
    this.activeStep(stepDef);
  }

  next() {
    if (this._activeIndex < this.length - 1) {
      this.activateIndex(this._activeIndex + 1);
    }
  }

  prev() {
    if (this._activeIndex > 0) {
      this.activateIndex(this._activeIndex - 1);
    }
  }


  first() {
    this.activeStep(this._stepDefs.first);
  }

  last() {
    this.activeStep(this._stepDefs.last);
  }

  clear() {
    this.containers.forEach(c => c.clear());
    this._stepDefs.forEach(s => s._viewRef = undefined);
  }

  get hasNext(): boolean {
    return this._stepDefs && this._activeIndex < this.length - 1;
  }

  get hasPrev(): boolean {
    return this._stepDefs && this._activeIndex > 0;
  }

  get length(): number {
    return this._stepDefs.length;
  }

  get width(): number {
    return this._elementRef.nativeElement.getBoundingClientRect().width;
  }

  private _getStepAtIndexOf(index: number) {
    if (index < 0 || index >= this._stepDefs.length) {
      throw new Error('There isn\'t no step at index: ' + this._activeIndex);
    }
    return this._stepDefs.toArray()[index];
  }

  private _getStepWithLabel(label: string) {
    const stepDef = this._stepDefs.find(s => s.label === label);
    if (stepDef) {
      return stepDef;
    }
    throw new Error('There isn\'t step with label: ' + label);
  }

  private _getInitialActiveStep(): MsStepperStepDef {
    if (!this._stepDefs || this._stepDefs.length === 0) {
      throw new Error(`The stepper have not a stepDef. Please add at least one`);
    }

    if (this._activeIndex) {
      return this._getStepAtIndexOf(this._activeIndex);
    }

    if (this._activeLabel) {
      return this._getStepWithLabel(this._activeLabel);
    }

    return this._stepDefs.first;
  }
}
