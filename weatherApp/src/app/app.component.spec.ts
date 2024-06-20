import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { WeatherService } from './services/weather.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { City, WeatherData } from './models/weather.model';
describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let weatherService: jasmine.SpyObj<WeatherService>;

  const mockCities: City[] = [
    {
      id: 'fd03',
      name: 'Abidjan',
      favorite: true,
      created_at: '2024-06-18T20:35:44.529Z',
      updated_at: '2024-06-19T17:42:27.578Z',
      temperature: 82.36,
    },
    {
      id: 'fed8',
      name: 'Lagos',
      favorite: false,
      created_at: '2024-06-19T19:22:33.525Z',
      updated_at: null,
      temperature: 82.72,
    },
    {
      id: '97c4',
      name: 'Budapest',
      favorite: false,
      created_at: '2024-06-19T19:22:45.496Z',
      updated_at: null,
      temperature: 82.51,
    },
  ].map((city) => ({ ...city, id: Number.parseInt(city.id, 16) }));

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
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
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
    const cities: City[] = [
      {
        id: 1,
        name: 'London',
        favorite: false,
        created_at: '2021-08-01',
        updated_at: '2021-08-01',
        temperature: 68,
      },
      {
        id: 2,
        name: 'Amsterdam',
        favorite: true,
        created_at: '2021-08-01',
        updated_at: '2021-08-01',
        temperature: 72,
      },
    ];
    weatherService.getCities.and.returnValue(of(cities));

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(component.cities.length).toBe(2);
      expect(component.cities[0].name).toBe('London');
    });
  }));

  // it('should get weather data for a city', waitForAsync(() => {
  //   const weatherData: WeatherData = {
  //     name: 'London',
  //     main: {temp = 68, temp_min = 65, temp_max = 70, pressure = 1012, humidity = 60},

  //   }

  it(`should have the 'weatherApp' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('weatherApp');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Hello, weatherApp'
    );
  });
});
