import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WeatherData } from '../models/weather.model';
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
}
