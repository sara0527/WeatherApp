import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, catchError, debounceTime, distinctUntilChanged, of, Subject, Subscription, switchMap } from 'rxjs';
import { LocationService } from 'src/app/core/services/location.service';
import { FavoritesService } from 'src/app/core/services/favorites.service'; // Correct the import path
import { Location } from '../../../../../shared/models/location.model'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchLocationComponent implements OnInit, OnDestroy {
  @Output() locationSelected = new EventEmitter<Location>();
  cities: Location[] = [];
  selectedCity: Location | null = null;
  isValidInput: boolean = true;
  errorMessage: string = '';
  private searchTerms = new BehaviorSubject<string>('Tel Aviv');
  private subscriptions: Subscription = new Subscription();

  constructor(private locationService: LocationService,
    private messageService: MessageService,
    private favoritesService: FavoritesService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const routeSubscription = this.route.paramMap.subscribe(params => {
      const locationKey = params.get('locationKey');
      if (locationKey) {
        this.loadLocationData(locationKey);
      }
    });

    this.subscriptions.add(routeSubscription);
    this.initializeSearch();
  }

  initializeSearch() {
    const searchSubscription = this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.locationService.getAutocompleteLocation(term)),
      catchError((error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch cities' });
        return of([]);
      })
    ).subscribe((data: any) => {
      this.cities = data;
      if (data.length > 0 && !this.selectedCity) {
        this.selectCity(data[0]);
        this.cdr.markForCheck();
      }
    });

    this.subscriptions.add(searchSubscription);
  }

  loadLocationData(locationKey: string) {
    const locationDataSubscription = this.locationService.getLocationByKey(locationKey).subscribe(
      (location: Location) => this.selectCity(location),
      error => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch cities' })
    );
    this.subscriptions.add(locationDataSubscription);

  }

  search(event: { query: string }) {
    const isValid = this.isEnglishOnly(event.query);
    this.isValidInput = isValid;
    this.errorMessage = isValid ? '' : 'Please use English letters only';
    this.cities = isValid ? this.cities : [];
    if (isValid) this.searchTerms.next(event.query);
  }

  isEnglishOnly(text: string): boolean {
    return /^[a-zA-Z\s]*$/.test(text);
  }

  selectCity(location: Location) {
    this.selectedCity = location;
    this.locationSelected.emit(location);
  }

  isFavorite(city: Location): boolean {
    return this.favoritesService.getFavorites().some((f: Location) => f.Key === city.Key);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

}