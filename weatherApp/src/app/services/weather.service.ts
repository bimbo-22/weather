import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { City, WeatherData } from '../models/weather.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeatherData(cityName: string): Observable<WeatherData> {
    const url = `${environment.weatherApiBaseUrl}/city/${cityName}/EN`;
    const headers = new HttpHeaders()
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

  getCities(): Observable<any> {
    return this.http.get<any>(`${environment.BackendApiBaseUrl}/cities`);
  }

  updateFavorite(city: City): Observable<City> {
    return this.http.put<City>(
      `${environment.BackendApiBaseUrl}/cities/${city.id}`,
      city
    );
  }

  addCity(city: City): Observable<City> {
    return this.http.post<City>(
      `${environment.BackendApiBaseUrl}/cities`,
      city
    );
  }

  deleteCity(id: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.BackendApiBaseUrl}/cities/${id}`
    );
  }
}
