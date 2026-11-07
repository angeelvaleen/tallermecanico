import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.page.html',
  styleUrls: ['./forbidden.page.scss'],
  standalone: false
})
export class ForbiddenPage implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  goHome(): void {
    this.location.back();
  }

}
