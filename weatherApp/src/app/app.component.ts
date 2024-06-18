import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WeatherService } from './services/weather.service';
import { WeatherData, City } from './models/weather.model';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { fahrenheitToCelsius } from './util';
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
  favoriteCities: any[] = [];

  constructor(
    private weatherService: WeatherService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    // fetch from api
    await this.getAllCities();
    if (this.cities && this.cities.length > 0) {
      this.getWeatherData(this.cities[0].name);
      // this.loadCities();
      console.log('Cities loaded');
    }

    console.log('City Name init:', this.cities);
    this.loadFavoriteCities();
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
        // response.main.temp = <number>response?.main?.temp ?? fahrenheitToCelsius(response.main.temp);
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

  // getAllCities(): void {
  //   this.http.get<any[]>(environment.BackendApiBaseUrl).subscribe({
  //     next: (cities: City[]) => {
  //       //@ts-ignore
  //       cities.sort((a, b) => b.favorite - a.favorite);
  //       this.cities = cities;
  //     },
  //     error: (err) => {
  //       console.error('Error fetching cities', err);
  //     },
  //   });
  // }

  private async getAllCities(): Promise<void> {
    try {
      const cities =
        (await this.http
          .get<City[]>(`${environment.BackendApiBaseUrl}/cities`)
          .toPromise()) ?? [];
      //@ts-ignore
      cities.sort((a, b) => b.favorite - a.favorite);
      this.cities = cities;
      console.log('Cities fetched:', this.cities);
    } catch (err) {
      console.error('Error fetching cities', err);
    }
  }

  toggleFavorite() {
    if (this.weatherData && this.cities) {
      const cityName = this.weatherData.name;
      let city = this.cities.find(
        (c) => c.name.toLowerCase() === cityName.toLowerCase()
      );

      if (!city) {
        // If city does not exist locally, create a new entry
        city = {
          id: this.cities.length + 1, // Generate a new ID
          name: this.weatherData.name,
          favorite: true,
          created_at: new Date().toISOString(),
          updated_at: null,
        };

        // Add new city to the backend
        this.weatherService.addCity(city).subscribe({
          next: (newCity) => {
            this.cities.push(newCity);
            this.isFavorite = newCity.favorite;
            this.loadFavoriteCities();
          },
          error: (err) => {
            console.error('Error adding city', err);
          },
        });
      } else {
        // Update existing city's favorite status
        if (city) {
          city.favorite = !city.favorite;
          city.updated_at = new Date().toISOString();

          // Update favorite status in the backend
          this.weatherService.updateFavorite(city).subscribe({
            next: () => {
              this.isFavorite = city!.favorite;
              console.log('Favorite status updated successfully');
              this.loadFavoriteCities();
            },
            error: (err) => {
              console.error('Error updating favorite status', err);
            },
          });
        }
      }
    }
  }

  private checkIfFavorite(cityName: string): boolean {
    if (!this.cities) return false;
    const city = this.cities.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase()
    );
    return city ? city.favorite : false;
  }

  private loadCities() {
    this.weatherService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (err) => {
        console.error('Error fetching cities', err);
      },
    });
  }

  private loadFavoriteCities() {
    // this.favoriteCities = this.cities.filter((city) => city.favorite);
    this.cities.forEach((city) => {
      this.weatherService.getWeatherData(city.name).subscribe({
        next: (data) => {
          city.temperature = data.main.temp;
        },
        error: (err) => {
          console.error('Error fetching weather data for ${city.name}', err);
        },
      });
    });
  }

  // remove
  deleteCity(city: City) {
    console.log('Remove button clicked for:', city);

    // Ensure the city object is correct
    if (typeof city === 'string') {
      console.error('Expected a city object but received a string:', city);
      return;
    }
    //
    // // Set city.favorite to false
    // city.favorite = false;
    // city.updated_at = new Date().toISOString();

    // Update favorite status in the backend
    this.weatherService.deleteCity(city.id).subscribe({
      next: () => {
        console.log('Favorite city removed successfully');
      },
      error: (err) => {
        console.error('Error removing favorite city', err);
      },
    });
  }

  testButtonClick(city: City) {
    console.log('Test button clicked for:', city);
    this.deleteCity(city);
  }
}

// toggleFavorite(city: City): void {
//   city.favorite = !city.favorite;
//   this.http
//     .put(`${environment.BackendApiBaseUrl}/${city.id}`, city)
//     .subscribe({
//       next: (response) => {
//         console.log('Favorite updated:', response);
//         this.getAllCities();
//       },
//       error: (err) => {
//         console.error('Error updating favorite', err);
//       },
//     });
// }
