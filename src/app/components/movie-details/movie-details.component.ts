import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from 'src/app/services/movies-service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LocalStorageService } from 'src/app/services/localStorageService';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.less'],
})
export class MovieDetailsComponent implements OnInit {
  movieId: any;
  movie: any = [];
  isInWatchList = false;
  constructor(
    private route: ActivatedRoute,
    private moviesService: MoviesService,
    private sanitizer: DomSanitizer,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');

    this.moviesService.getMovies().subscribe(
      (response) => {
        this.movie = response[parseInt(this.movieId)];
        this.initialWatchListValidation(this.movie.title);
      },
      (error) => {
        console.error('Error getting fake data array:', error);
      }
    );
  }

  getImagePath(movieTitle: string) {
    let urlSplited = movieTitle.split(' ');
    return `/assets/images/${urlSplited[0]}.png`;
  }

  getTrailerSafeUrl(trailerLink: string): SafeResourceUrl {
    const videoId = trailerLink.split('=');
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId[1]}`
    );
  }

  toggleBtnWatchList(event: Event) {
    let itemsInStorage = this.localStorageService.getItems('UserMovies');
    let isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      itemsInStorage.push(this.movie.title);
    } else {
      let indexMovieInWatchList = itemsInStorage.findIndex(
        (element: any) => element === this.movie.title
      );
      itemsInStorage.splice(indexMovieInWatchList, 1);
    }

    this.localStorageService.setItem('UserMovies', itemsInStorage);
  }

  initialWatchListValidation(movieName: string) {
    let itemsInStorage = this.localStorageService.getItems('UserMovies');

    let indexMovieInWatchList = itemsInStorage.findIndex(
      (element: any) => element === movieName
    );
    if (indexMovieInWatchList > -1) {
      this.isInWatchList = true;
    }
  }

  backToDash() {
    this.router.navigate(['/']);
  }
}
