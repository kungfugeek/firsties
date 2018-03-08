import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  private heroesUrl = 'http://localhost:3000/heroes';
  
  constructor(private messageService: MessageService,
    private http: HttpClient) { }
  
  getHeroes(): Observable<Hero[]> {
    this.log('HeroService: fetching heroes');
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => this.log('fetched heroes')),
        catchError(this.handleError('getHeroes', []))
      );
  }

  getHero(id: number): Observable<Hero> {
   const heroUrl = `${this.heroesUrl}/${id}`;
   this.log(`HeroService: fetching hero id=${id}`);
    return this.http.get<Hero>(heroUrl)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }
  
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero._id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
  
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((h: Hero) => this.log(`added hero w/ id=${h._id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
    
  }
   
  deleteHero(hero: Hero | string): Observable<Hero> {
    const id = typeof hero === 'string' ? hero : hero._id;
    const heroUrl = `${this.heroesUrl}/${id}`;
    return this.http.delete(heroUrl).pipe(
      tap(_ => this.log(`deleted hero ${id}`)),
      catchError(this.handleError<any>('deleteHero'))
    );
  }
  
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      return of([]);
    }
    
    return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
  
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
  
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
  
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
  
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
