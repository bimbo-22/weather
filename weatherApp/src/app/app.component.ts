import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather.service';
import { WeatherData, City } from './models/weather.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DecimalPipe],
})
export class AppComponent implements OnInit {
  titleControl = new FormControl(null);
  title = 'WeatherApp';
  cityName: string = '';
  weatherData?: WeatherData;
  isFavorite: boolean = false;
  cities: City[] = [];

  constructor(
    private weatherService: WeatherService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadSavedCities();
    if (this.cities && this.cities.length > 0) {
      this.getWeatherData(this.cities[0].name);
    }
  }

  onSubmit(): void {
    const city: any = this.titleControl.value;
    console.log('City Name:', city);
    this.getWeatherData(city);
    this.cityName = ''; // Clear cityName after logging
  }

  private getWeatherData(cityName: string) {
    this.weatherService.getWeatherData(cityName).subscribe({
      next: (response) => {
        console.log('Weather Data:', response);
        this.weatherData = response;
        this.isFavorite =
          this.cities?.find((city) => city.name === cityName)?.favorite ??
          false;
      },
      error: (err) => {
        console.error('Error fetching weather data', err);
      },
    });
  }

  private loadSavedCities(): void {
    this.weatherService.getCities().subscribe({
      next: (cities: City[]) => {
        cities.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
        this.cities = cities;
      },
      error: (err) => {
        console.error('Error fetching cities', err);
      },
    });
  }

  saveCity() {
    if (this.weatherData && this.weatherData.name) {
      const cityName = this.weatherData.name;
      let city = this.cities.find(
        (c) => c.name.toLowerCase() === cityName.toLowerCase()
      );

      if (!city) {
        const newCity: Partial<City> = {
          name: cityName,
          favorite: false,
          created_at: new Date().toISOString(),
          updated_at: null,
          temperature: this.weatherData.main.temp, // Make sure temperature is added
        };

        this.weatherService.addCity(newCity).subscribe({
          next: (addedCity) => {
            this.cities.push(addedCity); // Use the city object returned by the backend
            this.loadSavedCities(); // Refresh the list after adding a city
          },
          error: (err) => {
            console.error('Error adding city', err);
          },
        });
      }
    }
  }

  toggleFavorite(city: City) {
    city.favorite = !city.favorite;
    city.updated_at = new Date().toISOString();
    this.weatherService.updateFavorite(city).subscribe({
      next: (updatedCity) => {
        const index = this.cities.findIndex((c) => c.id === updatedCity.id);
        if (index !== -1) {
          this.cities[index] = updatedCity;
        }
      },
      error: (err) => {
        console.error('Error updating favorite status', err);
      },
    });
  }

  deleteCity(city: City) {
    console.log('Remove button clicked for:', city);

    if (typeof city === 'string') {
      console.error('Expected a city object but received a string:', city);
      return;
    }

    this.weatherService.deleteCity(city.id).subscribe({
      next: () => {
        console.log('City removed successfully');
        this.loadSavedCities(); // Refresh the list after deleting a city
      },
      error: (err) => {
        console.error('Error removing city', err);
      },
    });
  }
}
