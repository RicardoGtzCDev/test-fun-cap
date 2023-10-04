import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cursos' },
  {
    path: 'cursos',
    loadComponent: () => import('src/app/pages/test-report/test-report.component')
      .then((c) => c.TestReportComponent),
  },
  {
    path: '**',
    loadComponent: () => import('src/app/pages/not-found/not-found.component')
      .then((c) => c.NotFoundComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
