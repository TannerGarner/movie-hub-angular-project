import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { FirestoreService } from '../../services/firestore.service';
import { JsonPipe, DatePipe } from '@angular/common';
import { TmdbVideo, TmdbVideoResponse } from '../../interfaces/tmdb-video.interface';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-movie-details-page',
  standalone: false,
  templateUrl: './movie-details-page.component.html',
  styleUrl: './movie-details-page.component.scss'
})

export class MovieDetailsPageComponent implements OnInit, OnDestroy {
  public movieDetails: any = null;
  youtubeURL: string = '';
  comment: string = '';
  comments: string[] = [];
  movieId: number = 0;
  collection: any = null;
  router: Router;
  watchData$: Observable<any[]>;
  private watchDataSubscription: Subscription | undefined;
  hasWatched: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private firestoreService: FirestoreService,
    router: Router
  ) {
    this.router = router;
    this.watchData$ = this.firestoreService.getWatchData();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.movieId = +params['id'];
      this.loadMovieDetails();
      this.setupWatchDataSubscription();
    });
  }

  ngOnDestroy(): void {
    if (this.watchDataSubscription) {
      this.watchDataSubscription.unsubscribe();
    }
  }

  private setupWatchDataSubscription(): void {
    this.watchDataSubscription = this.watchData$.subscribe(data => {
      if (Array.isArray(data)) {
        const movieWatch = data.find(item => item.movieID === this.movieId);
        this.hasWatched = movieWatch?.hasWatched || false;
      }
    });
  }

  private loadMovieDetails() {
    this.tmdbService.getMovieById(this.movieId).subscribe((data) => {
      console.log(data);
      this.movieDetails = data;
      
      if (this.movieDetails.belongs_to_collection) {
        this.tmdbService.getCollectionById(this.movieDetails.belongs_to_collection.id)
          .subscribe((collectionData: any) => {
            console.log(collectionData);
            this.collection = collectionData;
          });
      }
    });

    this.tmdbService.getMovieTrailer(this.movieId).subscribe((data: TmdbVideoResponse) => {
      console.log(data);
      const trailer: TmdbVideo | undefined = data.results.find(
        (vid) => vid.site === 'YouTube' && vid.type === 'Trailer'
      );
      if (trailer) {
        this.youtubeURL = `https://www.youtube.com/embed/${trailer.key}`;
      } else {
        console.log('No trailer found');
      }
    });
  }

  markAsWatched() {
    this.firestoreService.addToHasWatched(this.movieId)
      .then(() => {
        console.log('Movie marked as watched');
      })
      .catch((error) => {
        console.error('Error marking movie as watched:', error);
      });
  }

  unmarkAsWatched() {
    // this.firestoreService.removeFromHasWatched(this.movieId).then(() => {
    //   console.log('Movie removed from watchlist');
    // }).catch((error) => {
    //   console.error('Error removing movie from watchlist:', error);
    // });
  }


  addComment() {
    if (this.comment) {
      this.comments.push(this.comment);
      this.comment = '';
    }
  }

  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
    window.scrollTo(0, 0);    
  }
}
