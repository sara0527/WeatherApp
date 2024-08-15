import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DailyForecast, Forecast } from 'src/app/shared/models/forecast.model';
import { Temperature } from 'src/app/shared/models/temperature.model';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastComponent implements OnInit {
  @Input() forecast: Forecast | null = null;
  //@Input() isFahrenheit: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  get dailyForecasts(): DailyForecast[] {
    return this.forecast?.DailyForecasts || [];
  }

  getTemperature(weather: Temperature): Number {
    return weather.Value;
  }

  // getUnit(): string {
  //   return this.isFahrenheit ? '°F' : '°C';
  // }

}
