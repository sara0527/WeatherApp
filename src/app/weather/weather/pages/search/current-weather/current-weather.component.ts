import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Location } from '../../../../../shared/models/location.model'
import { Subject, Subscription, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentWeatherComponent implements OnInit, OnChanges, OnDestroy {
  @Input() locationData: Location;
  currentWeather: CurrentWeather;
  isMetric: boolean = true;
  private temperatureUnitSubscription: Subscription;
  private destroy$ = new Subject<void>();


  constructor(private weatherService: WeatherService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.temperatureUnitSubscription = this.weatherService.temperatureUnitChanged
      .pipe(takeUntil(this.destroy$))
      .subscribe(isMetric => {
        this.isMetric = isMetric;
        this.cdr.markForCheck();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['locationData'] && this.locationData) {
      this.loadWeatherData();
    }
  }

  loadWeatherData() {
    this.weatherService.getCurrentWeather(this.locationData.Key).subscribe({
      next: (currentWeather: CurrentWeather) => {
        this.currentWeather = { ...currentWeather[0] };
        this.cdr.markForCheck();
      },
      error: (error) =>
        this.handleError(error)
    })

  }

  handleError(error: any) {
    console.error('An error occurred in search', error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load weather data' });
  }

  getTemperature(): Number {
    if (!this.currentWeather) return 0;
    return this.isMetric
      ? this.currentWeather.Temperature.Metric.Value
      : this.currentWeather.Temperature.Imperial.Value;
  }

  getUnit(): string {
    return this.isMetric ? '°C' : '°F';
  }

  getWeatherIconUrl(): string {
    if (!this.currentWeather) return '';
    const iconNumber = Number(this.currentWeather?.WeatherIcon) < 10
      ? `0${this.currentWeather.WeatherIcon}`
      : this.currentWeather.WeatherIcon;
    return `https://developer.accuweather.com/sites/default/files/${iconNumber}-s.png`;
  }


  ngOnDestroy(): void {
    if (this.temperatureUnitSubscription) {
      this.temperatureUnitSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

}
