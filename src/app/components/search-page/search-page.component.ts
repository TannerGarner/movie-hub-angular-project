import { Component } from '@angular/core';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { TmdbService } from '../../services/tmdb.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { TmdbSearchResponse } from '../../interfaces/tmdb-search-response.interface';

@Component({
  selector: 'app-search-page',
  standalone: false,
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss'
})
export class SearchPageComponent {
  public searchControl = new FormControl('');
  public searchRes$: Observable<TmdbSearchResponse>;
  public page: number = 1;

  constructor(private tmdbService: TmdbService) {
    this.searchRes$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap((searchQuery: string | null) => this.tmdbService.searchMoviesByTitle(searchQuery, this.page))
    );
  }

  handlePageEvent($event: PageEvent) {
    this.page = $event.pageIndex + 1;
    this.searchControl.setValue(this.searchControl.value, { emitEvent: true });
  }
}
