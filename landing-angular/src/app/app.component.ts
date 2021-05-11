import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isNavbarHidden = false;

  constructor(private router:Router) {
    router.events.subscribe(() => this.updateNavbar());
  }

  ngOnInit() {
    this.updateNavbar();
  }

  updateNavbar() {
    if (this.router.url === '/register') {
      this.isNavbarHidden = true;
    } else {
      this.isNavbarHidden = false;
    }
  }

}
