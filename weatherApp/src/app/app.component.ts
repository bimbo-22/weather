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
  titleControl = new FormControl(null); // form control for the city name input
  title = 'WeatherApp';
  cityName: string = '';
  weatherData?: WeatherData; // holds weather data for the cities
  isFavorite: boolean = false; // track if the city is a favorite
  cities: City[] = []; // arrays to store the list of cities

  // dependency injection for the weather service and http client
  constructor(
    private weatherService: WeatherService,
    private http: HttpClient
  ) {}

  // initializing all data-bound properties
  async ngOnInit(): Promise<void> {
    await this.loadSavedCities(); // load saved cities from the backend
    if (this.cities && this.cities.length > 0) {
      this.getWeatherData(this.cities[0].name); // get weather data for the first city
    }
  }

  // handles the form submission to get the weather data for the city
  onSubmit(): void {
    const city: any = this.titleControl.value;
    console.log('City Name:', city);
    this.getWeatherData(city);
    this.cityName = ''; // Clear cityName after logging
  }

  // fetches the weather data for the city
  private getWeatherData(cityName: string) {
    this.weatherService.getWeatherData(cityName).subscribe({
      next: (response) => {
        console.log('Weather Data:', response);
        this.weatherData = response;
        // check if the city is a favorite
        this.isFavorite =
          this.cities?.find((city) => city.name === cityName)?.favorite ??
          false;
      },
      error: (err) => {
        // logging errors
        console.error('Error fetching weather data', err);
      },
    });
  }

  // load saved cities from the backend service
  private loadSavedCities(): void {
    this.weatherService.getCities().subscribe({
      next: (cities: City[]) => {
        // to sort cities: favorites first
        cities.sort((a, b) => (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0));
        this.cities = cities;
      },
      error: (err) => {
        // logging errors
        console.error('Error fetching cities', err);
      },
    });
  }

  // saving the current city to the list of saved cities
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

  // sets the favorite status of the city
  toggleFavorite(city: City) {
    city.favorite = !city.favorite; // Set the favorite status
    city.updated_at = new Date().toISOString(); // Update the updated_at timestamp
    this.weatherService.updateFavorite(city).subscribe({
      // Update the favorite status
      next: (updatedCity) => {
        const index = this.cities.findIndex((c) => c.id === updatedCity.id);
        if (index !== -1) {
          this.cities[index] = updatedCity; // Update the city in the list
        }
      },
      error: (err) => {
        console.error('Error updating favorite status', err);
      },
    });
  }

  // deleting the city from the list of saved cities
  deleteCity(city: City) {
    console.log('Remove button clicked for:', city);

    if (typeof city === 'string') {
      // Check if the city is a string
      console.error('Expected a city object but received a string:', city);
      return;
    }

    this.weatherService.deleteCity(city.id).subscribe({
      // Delete the city by id
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
