import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MsStepper} from './stepper';
import {MsStepperStepDef} from './stepper-step';
import {MsStepperNext, MsStepperPrev} from './stepper-directives';

@NgModule({
  imports: [CommonModule],
  declarations: [MsStepper, MsStepperStepDef, MsStepperNext, MsStepperPrev],
  exports: [MsStepper, MsStepperStepDef, MsStepperNext, MsStepperPrev]
})
export class MsStepperModule {
}
