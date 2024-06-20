import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { City, WeatherData } from '../models/weather.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  // creating a constructor for the HttpClient
  constructor(private http: HttpClient) {}

  // getWeatherData method to fetch weather data for a city
  getWeatherData(cityName: string): Observable<WeatherData> {
    const url = `${environment.weatherApiBaseUrl}/city/${cityName}/EN`; // setting the URL for the API with the chosen city
    const headers = new HttpHeaders() // setting the values from the API
      .set(
        environment.XRapidAPIHostHeaderName,
        environment.XRapidAPIHostHeaderValue
      )
      .set(
        environment.XRapidAPIKeyHeaderName,
        environment.XRapidAPIKeyHeaderValue
      );
    return this.http.get<WeatherData>(url, { headers });
  }

  // get all cities from API
  getCities(): Observable<any> {
    return this.http.get<any>(`${environment.BackendApiBaseUrl}/cities`);
  }

  // set the id of favorite city (true or false)
  updateFavorite(city: City): Observable<City> {
    return this.http.put<City>(
      `${environment.BackendApiBaseUrl}/cities/${city.id}`,
      city
    );
  }

  // saving the city
  addCity(city: Partial<City>): Observable<City> {
    return this.http.post<City>(
      `${environment.BackendApiBaseUrl}/cities`,
      city
    );
  }

  // deleting the city
  deleteCity(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.BackendApiBaseUrl}/cities/${id}`
    );
  }
}
