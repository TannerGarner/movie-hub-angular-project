import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { FirestoreService } from '../../services/firestore.service';
import { TmdbVideo, TmdbVideoResponse } from '../../interfaces/tmdb-video.interface';
import { Observable, Subscription } from 'rxjs';

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
  // comments: any[] = [];
  movieId: number = 0;
  collection: any = null;
  router: Router;
  watchData$: Observable<any[]>;
  private watchDataSubscription: Subscription | undefined;
  comments$: Observable<any[]> | undefined;
  // private commentsSubscription: Subscription | undefined;
  hasWatched: boolean = false;
  onWatchList: boolean = false;
  rating: number = 0;
  ratingDialogueOpen: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService,
    private firestoreService: FirestoreService,
    // private cdr: ChangeDetectorRef,
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
      // this.setupCommentsSubscription();
      this.comments$ = this.firestoreService.getAllComments(this.movieId);
    });
  }

  ngOnDestroy(): void {
    if (this.watchDataSubscription) {
      this.watchDataSubscription.unsubscribe();
    }
    // if (this.commentsSubscription) {
    //   this.commentsSubscription.unsubscribe();
    // }
  }

  private setupWatchDataSubscription(): void {
    this.watchDataSubscription = this.watchData$.subscribe(data => {
      if (Array.isArray(data)) {
        const movieWatch = data.find(item => item.movieID === this.movieId);
        this.hasWatched = movieWatch?.hasWatched || false;
        this.onWatchList = movieWatch?.onWatchList || false;
        this.rating = movieWatch?.rating || null;
      }
    });
  }

  // private setupCommentsSubscription(): void {
  //   console.log("0 this.comments:", this.comments);
  //   this.commentsSubscription = this.firestoreService
  //     .getAllComments(this.movieId)
  //     .subscribe(comments => {
  //       this.comments = comments;
  //       this.cdr.detectChanges();
  //       console.log("this.comments:", this.comments);
  //     });

  //   // this.comments$ = this.firestoreService.getAllComments(this.movieId);
  //   // this.commentsSubscription = this.comments$.subscribe(comments => {
  //   //   this.comments = comments;
  //   //   console.log("this.comments:", this.comments);
  //   // });
  // }

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

  addToWatchList() {
    this.firestoreService.addToWatchlist(this.movieId)
      .then(() => {
        alert('Movie added to watchlist');
      })
      .catch((error) => {
        alert(`Error adding movie to watchlist: ${error}`);
      });
  }

  removeFromWatchList() {
    this.firestoreService.removeFromWatchlist(this.movieId)
      .then(() => {
        alert('Movie removed from watchlist');
      })
      .catch((error) => {
        alert(`Error removing movie from watchlist: ${error}`);
      });
  }

  markAsWatched() {
    this.firestoreService.addToHasWatched(this.movieId)
      .then(() => {
        alert('Movie marked as watched');
      })
      .catch((error) => {
        alert(`Error marking movie as watched: ${error}`);      });
  }

  unmarkAsWatched() {
    this.firestoreService.removeFromHasWatched(this.movieId).then(() => {
      alert('Movie unmarked as watched');
    }).catch((error) => {
      alert(`Error unmarking movie as watched: ${error}`);
    });
  }

  toggleRatingDialog() {
    this.ratingDialogueOpen = !this.ratingDialogueOpen;
  }

  setRating(rate: number) {
    this.rating = rate;
    this.firestoreService.rateMovie(this.movieId, rate)
      .then(() => {
        console.log('Rating set successfully');
        this.toggleRatingDialog(); // Close the dialog after setting the rating
      })
      .catch((error) => {
        console.error('Error setting rating:', error);
      });

  }

  addComment() {
    if (this.comment.trim()) {
      this.firestoreService.addComment(this.movieId, this.comment.trim())
        .then(() => {
          console.log('Comment added successfully');
          this.comment = ''; // Clear input after successful submission
        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        });
    }
  }

  deleteComment(commentId: string) {
    // this.firestoreService.deleteComment(commentId)
    //   .then(() => {
    //     console.log('Comment deleted successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error deleting comment:', error);
    //   });
  }


  goToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
    window.scrollTo(0, 0);    
  }
}
