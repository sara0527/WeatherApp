import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchPage } from './pages/search/seach-page/search.page';
import { WeatherRoutingModule } from './weather-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchLocationComponent } from './pages/search/search-location/search-location.component';
import { CurrentWeatherComponent } from './pages/search/current-weather/current-weather.component';
import { ForecastComponent } from './pages/search/forecast/forecast.component';


@NgModule({
  declarations: [SearchPage, SearchLocationComponent, CurrentWeatherComponent, ForecastComponent],
  imports: [CommonModule, WeatherRoutingModule, SharedModule],
  providers: [MessageService]


})
export class WeatherModule { }
