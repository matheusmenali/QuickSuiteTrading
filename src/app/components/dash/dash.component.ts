import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/localStorageService';
import { MoviesService } from 'src/app/services/movies-service';

@Component({
  selector: 'app-dash',
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.less'],
})
export class DashComponent implements OnInit {
  moviesList: any = [];

  constructor(
    private moviesService: MoviesService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.moviesService.getMovies().subscribe(
      (response) => {
        response.forEach((movie: any) => {
          movie['releaseDateObj'] = new Date(movie.releasedDate);
          movie['isOnWatchList'] = false;
          this.moviesList.push(movie);
        });
        this.initialVerificationWatchListMovies();
      },
      (error) => {
        console.error('Error getting fake data array:', error);
      }
    );
  }

  getThumbnailUrl(trailerLink: string) {
    let urlSplited = trailerLink.split('=');
    return `https://img.youtube.com/vi/${urlSplited[1]}/default.jpg`;
  }

  sortBy(sortParam: string) {
    if (sortParam === 'title') {
      this.moviesList.sort((a: any, b: any) => {
        const movieA = a['title'].toLowerCase();
        const movieB = b['title'].toLowerCase();
        return movieA.localeCompare(movieB);
      });
    } else {
      this.moviesList.sort((a: any, b: any) => {
        const movieA = a['releaseDateObj'];
        const movieB = b['releaseDateObj'];
        return movieA.getTime() - movieB.getTime();
      });
    }
  }

  addWatchList(movie: string, indexOfMovie: number) {
    let itemsInStorage = this.localStorageService.getItems('UserMovies');

    if (itemsInStorage) {
      let movieInWatchList = itemsInStorage.findIndex(
        (element: any) => element === movie
      );
      if (movieInWatchList < 0) {
        itemsInStorage.push(movie);
        this.moviesList[indexOfMovie]['isOnWatchList'] = true;
      }
    } else {
      itemsInStorage = [movie];
      this.moviesList[indexOfMovie]['isOnWatchList'] = true;
    }

    this.localStorageService.setItem('UserMovies', itemsInStorage);
  }

  initialVerificationWatchListMovies() {
    let itemsInStorage = this.localStorageService.getItems('UserMovies');

    if (itemsInStorage == null || itemsInStorage == undefined) {
      this.localStorageService.setItem('UserMovies', []);
    }

    itemsInStorage.forEach((item: any) => {
      let indexMovieInWatchList = this.moviesList.findIndex(
        (element: any) => element.title === item
      );
      if (indexMovieInWatchList > -1) {
        this.moviesList[indexMovieInWatchList]['isOnWatchList'] = true;
      }
    });
  }

  redirect(index: number) {
    this.router.navigate(['/movie-details', index]);
  }
}
