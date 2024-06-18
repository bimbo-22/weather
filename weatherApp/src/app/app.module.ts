import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { RouterModule } from '@angular/router';
// import { AppComponent } from './app.component';
import { WeatherService } from './services/weather.service';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    RouterModule.forRoot([]),
  ],
  providers: [WeatherService, provideHttpClient(withFetch())],
})
export class AppModule {}
