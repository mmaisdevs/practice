import { Component, OnInit, Input,Output } from '@angular/core';
import { from, Observable } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs'
import { HttpService } from '../http.service'
import { EventEmitter } from '@angular/core';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  @Input() keyword: any; 
  @Output() reset:EventEmitter<any> = new EventEmitter()
  count: number = 0; 
  active: Boolean = true;
  activeId:number = 0;
  private searchTerms = new Subject<Object>();
  result: any[];
  constructor(
    private httpService: HttpService
  ) { }
  ngOnInit(): void {
    //函数防抖
    this.searchTerms.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((params: Object) => {
      this.httpService.getSearchResult(params).subscribe(data => {
        if (!data.nodes) return
        this.count = data.nodes.length;
        this.result = data.nodes
      })
    })
  }
  getResult(params: Object): void {
    this.searchTerms.next(params);
  }
  getRelation(id:string):void{
    this.reset.emit(id)
  }

}
