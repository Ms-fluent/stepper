import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MsStepperModule} from "./ms-stepper";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MsStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
