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

  constructor(private favoritesService: FavoritesService) { }

  ngOnInit(): void {
  }

  onLocationSelected(location: Location) {
    this.selectedLocation = location;
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

