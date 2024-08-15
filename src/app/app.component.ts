import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from './core/services/loader.service';
import { WeatherService } from './core/services/weather.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  displayLoading = false;
  isMetric = false;
  private loaderSubscription: Subscription;

  constructor(private loaderService: LoaderService, private weatherService: WeatherService) { }

  ngOnInit() {
    this.loaderSubscription = this.loaderService.stateChange.subscribe((loaderState) => {
      setTimeout(() => {
        this.displayLoading = loaderState;
      });
    });
  }

  changeTemperatureUnit() {
    this.isMetric = !this.isMetric;
    this.weatherService.isMetric = this.isMetric;
    this.weatherService.temperatureUnitChanged.next(this.isMetric);
  }

  ngOnDestroy() {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }
}
