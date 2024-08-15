import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Location } from '../../../../../shared/models/location.model'
import { MessageService } from 'primeng/api';
import { WeatherService } from 'src/app/core/services/weather.service';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { FavoritesService } from 'src/app/core/services/favorites.service';
import { forkJoin, Subject, Subscription, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPage implements OnInit {
  selectedLocation: Location;
  currentWeather: CurrentWeather;
  forecast: Forecast;
  private destroy$ = new Subject<void>();

  constructor(private weatherService: WeatherService,
    private favoritesService: FavoritesService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
  }

  onLocationSelected(location: Location) {
    this.selectedLocation = location;
    this.loadWeatherData();
  }

   loadWeatherData(){
    forkJoin({
      currentWeather: this.weatherService.getCurrentWeather(this.selectedLocation.Key),
      forecast: this.weatherService.getForecast(this.selectedLocation.Key)
    }).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: ({ currentWeather, forecast }) => {
        if (currentWeather) {
          this.currentWeather = { ...currentWeather[0] };
        } else {
          this.handleError(new Error('No current weather data available'));
        }
        this.forecast = { ...forecast };
        this.cdr.markForCheck();
      },
      error: (error) => this.handleError(error)
    });
  }


  handleError(error: any) {
    console.error('An error occurred in search', error);
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load weather data' });
  }

  isFavorite(city: Location): boolean {
    return this.favoritesService.getFavorites().some((f: Location) => f.Key === city.Key);
  }

  toggleFavorite(city: Location) {
    if (this.isFavorite(city)) {
      this.favoritesService.removeFromFavorites(city.Key);
    } else {
      this.favoritesService.addToFavorites(city);
    }
  }


}

