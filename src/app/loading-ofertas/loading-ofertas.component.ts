import { Component, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-loading-ofertas',
  templateUrl: './loading-ofertas.component.html',
  styleUrls: ['./loading-ofertas.component.css']
})
export class LoadingOfertasComponent implements AfterViewInit, OnDestroy {

  constructor() { }

  ngAfterViewInit() {
    $('footer').addClass('fixed-bottom')
  }

  ngOnDestroy() {
    $('footer').removeClass('fixed-bottom')
  }

}
