import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { AppComponent } from './app.component';
import { WeatherService } from './services/weather.service';
import { RouterModule } from '@angular/router';

@NgModule({
  // declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([]),
  ],
  providers: [WeatherService, provideHttpClient(withFetch())],
})
export class AppModule {}
