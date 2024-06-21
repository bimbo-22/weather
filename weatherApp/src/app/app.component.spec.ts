import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { WeatherService } from './services/weather.service';
import { AppComponent } from './app.component';
import { of, throwError } from 'rxjs';
import { WeatherData, City } from './models/weather.model';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherService: jasmine.SpyObj<WeatherService>;

  const mockCities: City[] = [
    {
      id: 64771,
      name: 'Abidjan',
      favorite: true,
      created_at: '2024-06-18T20:35:44.529Z',
      updated_at: '2024-06-19T17:42:27.578Z',
      temperature: 82.36,
    },
    {
      id: 65240,
      name: 'Lagos',
      favorite: false,
      created_at: '2024-06-19T19:22:33.525Z',
      updated_at: null,
      temperature: 82.72,
    },
    {
      id: 38852,
      name: 'Budapest',
      favorite: false,
      created_at: '2024-06-19T19:22:45.496Z',
      updated_at: null,
      temperature: 82.51,
    },
  ];

  const mockWeatherData: WeatherData = {
    name: 'Abidjan',
    main: {
      temp: 82.36,
      feels_like: 82.36,
      temp_min: 80,
      temp_max: 85,
      pressure: 1012,
      humidity: 60,
    },
  };

  beforeEach(waitForAsync(() => {
    const weatherServiceSpy = jasmine.createSpyObj('WeatherService', [
      'getWeatherData',
      'getCities',
      'addCity',
      'updateFavorite',
      'deleteCity',
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, AppComponent], // Import AppComponent here
      providers: [{ provide: WeatherService, useValue: weatherServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    weatherService = TestBed.inject(
      WeatherService
    ) as jasmine.SpyObj<WeatherService>;
  }));

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should load saved cities on init', waitForAsync(() => {
    weatherService.getCities.and.returnValue(of(mockCities));

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(component.cities.length).toBe(3);
      expect(component.cities[0].name).toBe('Abidjan');
      expect(component.cities[1].name).toBe('Lagos');
      expect(component.cities[2].name).toBe('Budapest');
    });
  }));

  it('should get weather data for a city', waitForAsync(() => {
    weatherService.getWeatherData.and.returnValue(of(mockWeatherData));

    component.getWeatherData('Abidjan');

    fixture.whenStable().then(() => {
      expect(component.weatherData).toEqual(mockWeatherData);
    });
  }));

  it('should handle error while fetching weather data', waitForAsync(() => {
    weatherService.getWeatherData.and.returnValue(throwError({ status: 404 }));

    component.getWeatherData('Abidjan');

    fixture.whenStable().then(() => {
      expect(component.weatherData).toBeUndefined();
    });
  }));

  it('should save a new city', waitForAsync(() => {
    const newCity: Partial<City> = {
      name: 'Abidjan',
      favorite: false,
      created_at: new Date().toISOString(),
      updated_at: null,
      temperature: 82.36,
    };
    const addedCity = { ...newCity, id: 64771 };
    weatherService.addCity.and.returnValue(of(addedCity as City));

    component.weatherData = {
      name: 'Abidjan',
      main: { temp: 82.36 },
      weather: [{ description: 'Sunny', icon: '01d' }],
    } as WeatherData;
    component.saveCity();

    fixture.whenStable().then(() => {
      expect(weatherService.addCity).toHaveBeenCalledWith(newCity);
      expect(component.cities.length).toBe(4); // assuming loadSavedCities will refresh the list
    });
  }));

  it('should toggle favorite status', waitForAsync(() => {
    const city: City = {
      id: 64771,
      name: 'Abidjan',
      favorite: true,
      created_at: '2024-06-18T20:35:44.529Z',
      updated_at: '2024-06-19T17:42:27.578Z',
      temperature: 82.36,
    };
    weatherService.updateFavorite.and.returnValue(
      of({ ...city, favorite: false })
    );

    component.toggleFavorite(city);

    fixture.whenStable().then(() => {
      expect(city.favorite).toBeFalse();
      expect(weatherService.updateFavorite).toHaveBeenCalledWith({
        ...city,
        favorite: false,
      });
    });
  }));

  it('should delete a city', waitForAsync(() => {
    const city: City = {
      id: 64771,
      name: 'Abidjan',
      favorite: true,
      created_at: '2024-06-18T20:35:44.529Z',
      updated_at: '2024-06-19T17:42:27.578Z',
      temperature: 82.36,
    };
    weatherService.deleteCity.and.returnValue(of(void 0)); // Ensure the returned observable is of type void

    component.deleteCity(city);

    fixture.whenStable().then(() => {
      expect(weatherService.deleteCity).toHaveBeenCalledWith(city.id);
    });
  }));
});
