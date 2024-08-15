import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';

@Component({
  selector: 'app-current-weather',
  templateUrl: './current-weather.component.html',
  styleUrls: ['./current-weather.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentWeatherComponent implements OnInit {
  @Input() weather: CurrentWeather | null = null;
  isMetric: boolean = true;

  constructor(private weatherService: WeatherService) { }

  ngOnInit(): void {
    this.weatherService.temperatureUnitChanged.subscribe(value => {
      debugger
      this.isMetric = value
    })
  }

  getTemperature(): Number {
    if (!this.weather) return 0;
    return this.isMetric
      ? this.weather.Temperature.Metric.Value
      : this.weather.Temperature.Imperial.Value;
  }

  getUnit(): string {
    return this.isMetric ? '°C' : '°F';
  }

}
