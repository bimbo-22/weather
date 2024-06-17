import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather.service';
import { WeatherData } from './models/weather.model';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DecimalPipe],
})
export class AppComponent implements OnInit {
  title = 'WeatherApp';
  cityName: string = 'London';
  weatherData?: WeatherData;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.getWeatherData(this.cityName);
    this.cityName = '';
  }

  onSubmit() {
    this.getWeatherData(this.cityName);
    this.cityName = '';
  }

  private getWeatherData(cityName: string) {
    this.weatherService.getWeatherData(cityName).subscribe({
      next: (response) => {
        this.weatherData = response;
        console.log(response);
      },
      error: (err) => {
        console.error('Error fetching weather data', err);
      },
    });
  }
}
