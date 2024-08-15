import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';
import { DailyForecast, Forecast } from 'src/app/shared/models/forecast.model';
import { Location } from '../../../../../shared/models/location.model'
import { Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastComponent implements OnInit, OnDestroy {
  @Input() locationData: Location;
  forecast: Forecast;
  isMetric = true;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef) {
    this.subscribeToTemperatureUnitChanges();
  }

  ngOnInit(): void {
  }

  subscribeToTemperatureUnitChanges() {
    this.weatherService.temperatureUnitChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMetric => {
        this.isMetric = isMetric;
        this.loadWeatherData(isMetric);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['locationData'] && this.locationData) {
      this.loadWeatherData();
    }
  }

  loadWeatherData(isMetric: boolean = true) {
    this.weatherService.getForecast(this.locationData.Key, isMetric).subscribe({
      next: (forecastItems: Forecast) => {
        this.forecast = forecastItems;
        this.cdr.markForCheck();
      },
      error: (error) =>
        this.handleError(error)
    });
  }

  handleError(error: any) {
    console.error('An error occurred in search', error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load weather data' });
  }

  get dailyForecasts(): DailyForecast[] {
    return this.forecast?.DailyForecasts || [];
  }

  getUnit(): string {
    return this.isMetric ? '°C' : '°F';
  }

  getIconUrl(icon: number): string {
    const iconNumber = icon < 10 ? `0${icon}` : `${icon}`;
    return `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
