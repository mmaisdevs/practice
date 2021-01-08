import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { from, Observable, of, Subject } from 'rxjs'


@Injectable({
  providedIn: 'root'
})
export class HttpService {
  //后端请求地址
  private baseurl = 'http://104.214.140.219:8082/api/' 
  //请求参数
  httpOption = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  constructor(
    private http: HttpClient
  ) { }

  initData(): Observable<any> {
    return this.http.get<any>(this.baseurl + 'DataStoreMgmt').pipe(
      tap(),
      catchError(this.handleError<any>(''))
    )
  }
  getScenarios(datastoreName: string): Observable<any> {
    return this.http.get<any>(this.baseurl + `Graph/scenarios?datastoreName=${datastoreName}`).pipe(
      tap(),
      catchError(this.handleError<any>(''))
    )
  }
  getVisulize(params: any): Observable<any> {
    return this.http.get<any>(this.baseurl + `Graph/visulize?datastoreName=${params.datastoreName}&scenarioName=${params.scenarioName}`).pipe(
      tap(),
      catchError(this.handleError<any>(''))
    )
  }
  getColors(params: any): Observable<any> {
    return this.http.get<any>(this.baseurl + `Config/entitycolor?datastoreName=${params.datastoreName}&scenarioName=${params.scenarioName}`).pipe(
      tap(),
      catchError(this.handleError<any>(''))
    )
  }
  getSearchResult(params: any): Observable<any> {
    return this.http.get<any>(this.baseurl + `Graph/search?datastoreName=${params.datastoreName}&keyword=${params.keyword}`).pipe(
      tap(),
      catchError(this.handleError<any>(''))
    )
  }
  getRelations(params: any): Observable<any> {
    return this.http.get<any>(this.baseurl + `Graph/relations/${params.id}?datastoreName=${params.datastoreName}`).pipe(
      tap(),
      catchError(this.handleError<any>(''))
    )
  }




  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
  log(str: string): void {
    console.log(str)
  }
}

