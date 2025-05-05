import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../services/tmdb.service';
import { JsonPipe, DatePipe } from '@angular/common';
import { TmdbVideo, TmdbVideoResponse } from '../../interfaces/tmdb-video.interface';

@Component({
  selector: 'app-movie-details-page',
  standalone: false,
  templateUrl: './movie-details-page.component.html',
  styleUrl: './movie-details-page.component.scss'
})

export class MovieDetailsPageComponent implements OnInit {
  public movieDetails: any = null;
  youtubeURL: string = '';
  comment: string = '';
  comments: string[] = [];
  movieId: number = 0;
  collection: any = null;

  constructor(
    private route: ActivatedRoute,
    private tmdbService: TmdbService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.movieId = +params['id']; // Convert string to number using '+'
      this.loadMovieDetails();
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

  addComment() {
    if (this.comment) {
      this.comments.push(this.comment);
      this.comment = '';
    }
  }

  goToMovieDetails(movieId: number) {
    this.movieId = movieId;
    this.loadMovieDetails();
  }
}
