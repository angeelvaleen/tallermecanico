import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.page.html',
  styleUrls: ['./forbidden.page.scss'],
  standalone: false
})
export class ForbiddenPage implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  goHome(): void {
    this.router.navigateByUrl('/tabs/workorders/list', { replaceUrl: true });
  }

}
