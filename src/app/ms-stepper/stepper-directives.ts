import {Directive, ElementRef, HostListener, OnInit} from '@angular/core';
import {MsStepper} from './stepper';

@Directive({
  selector: '[ms-stepper-next], [msStepperNext]'
})
export class MsStepperNext implements OnInit {
  constructor(private _stepper: MsStepper, private _elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    this._stepper.stepChange.subscribe(() => {
      if (this._stepper.hasNext) {
        this._elementRef.nativeElement.removeAttribute('disabled');
      } else {
        this._elementRef.nativeElement.setAttribute('disabled', 'true');
      }
    });
  }

  @HostListener('click')
  click() {
    this._stepper.next();
  }
}

@Directive({
  selector: '[ms-stepper-prev], [msStepperPrev]'
})
export class MsStepperPrev implements OnInit {

  constructor(private _stepper: MsStepper, private _elementRef: ElementRef<HTMLElement>) {
  }

  ngOnInit(): void {
    this._stepper.stepChange.subscribe(() => {
      if (this._stepper.hasPrev) {
        this._elementRef.nativeElement.removeAttribute('disabled');
      } else {
        this._elementRef.nativeElement.setAttribute('disabled', 'true');
      }
    });
  }

  @HostListener('click')
  click() {
    this._stepper.prev();
  }
}
