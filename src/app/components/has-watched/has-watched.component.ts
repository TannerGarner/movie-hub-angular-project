import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { FirestoreService } from '../../services/firestore.service';
import { forkJoin } from 'rxjs';
import { Movie } from '../../interfaces/movie';

@Component({
  selector: 'app-has-watched',
  standalone: false,
  templateUrl: './has-watched.component.html',
  styleUrl: './has-watched.component.scss'
})
export class HasWatchedComponent implements OnInit {
  public movieDetails: any = null;
  public watchData: any[] = [];
  public userId = localStorage.getItem('userId');
  public mappedMovies: any = null;

  constructor(
    router: Router, 
    private tmdbService: TmdbService,
    private fireService: FirestoreService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fireService.getWatchData().subscribe(
      data => {
        this.watchData = data;

        const movieRequests = this.watchData
        .filter(item => item.hasWatched)
        .map(item => this.tmdbService.getMovieById(item.movieID)
        )
        
        forkJoin(movieRequests).subscribe((movies: Movie[]) => {
          this.mappedMovies = movies.map(movie => ({
            id: movie.id,
            title: movie.title,
            budget: movie.budget,
            poster_path: movie.poster_path,
            release_date: movie.release_date,
          }));
        this.cdr.detectChanges();

          console.log(this.mappedMovies)
        });
      }
    )
  }

  detailsTest() {
    this.fireService.addToHasWatched(349)
  }

  detailsRemoveTest() {
    this.fireService.removeFromHasWatched(349)
  }

}