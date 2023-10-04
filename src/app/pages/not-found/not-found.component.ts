import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styles: [],
  standalone: true,
  imports: [],
})
export class NotFoundComponent {
  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,

  ) {}

  irAlInicio = () => {
    this.router.navigate([''], { relativeTo: this.aRoute });
  };
}
