import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather.service';
import { WeatherData, City } from './models/weather.model';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {environment} from "../environments/environment";
import {fahrenheitToCelsius} from "./util";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],

  providers: [DecimalPipe],
})
export class AppComponent implements OnInit {
  titleControl = new FormControl(null);
  title = 'WeatherApp';
  cityName: string = '';
  weatherData?: WeatherData;
  cities?: City[];

  constructor(
    private weatherService: WeatherService,
  private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    // fetch from api
    await this.getAllCities();
    if (this.cities) {
      this.getWeatherData(this.cities[0].name);
    }

    console.log('City Name init:', this.cities);
  }

  onSubmit(): void {
    const city:any = this.titleControl.value;
    console.log('City Name:', city);
    this.getWeatherData(city);
    this.cityName = ''; // Clear cityName after logging
  }

  private getWeatherData(cityName: string) {
    this.weatherService.getWeatherData(cityName).subscribe({
      next: (response) => {
        // response.main.temp = <number>response?.main?.temp ?? fahrenheitToCelsius(response.main.temp);
        console.log('Weather Data:', response)
        this.weatherData = response;
      },
      error: (err) => {
        console.error('Error fetching weather data', err);
      },
    });
  }

  getAllCities(): void {
    this.http.get<any[]>(environment.BackendApiBaseUrl).subscribe({
      next: (cities: City[]) => {
        //@ts-ignore
        cities.sort((a, b) => b.favorite - a.favorite);
        this.cities = cities;
      },
      error: (err) => {
        console.error('Error fetching cities', err);
      },
    });
  }

}
