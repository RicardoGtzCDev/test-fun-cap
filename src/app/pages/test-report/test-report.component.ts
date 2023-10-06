import { Component } from '@angular/core';
import { TestReportService } from 'src/app/core/api/test-report.service';
import { CoreModule } from 'src/app/core/core.module';
import { CourseCardComponent } from 'src/app/shared/components/course-card/course-card.component';
import { InscriptionsFilterComponent } from 'src/app/shared/components/inscriptions-filter/inscriptions-filter.component';
import { UserHeaderComponent } from 'src/app/shared/components/user-header/user-header.component';
import { IInscription, IPerson } from 'src/app/shared/models/test-report';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CoreModule, UserHeaderComponent, InscriptionsFilterComponent, CourseCardComponent],
})
export class TestReportComponent {
  email: string = '';
  user!: IPerson;
  inscriptions!: IInscription[];
  mappedInscriptions: IInscription[] = [];
  paginatedInscriptions: IInscription[] = [];
  pagination: number[] = [];
  currentPage: number = 1;

  constructor(
    private testReportService: TestReportService,
  ) {
    testReportService.getTestReport().subscribe({
      next: (response) => {
        this.email = response.email;
        [this.user] = response.people;
        this.inscriptions = response.inscriptions;
        this.mappedInscriptions = response.inscriptions;
        let pages = Math.floor(this.mappedInscriptions.length / 8);
        if (this.mappedInscriptions.length % 8 > 0) { pages += 1; }
        this.pagination = [...Array(pages).keys()];
        this.paginate(0);
      },
      error: () => { },
    });
  }

  onMappedInscriptions = (items: IInscription[]) => {
    this.mappedInscriptions = items;
    let pages = Math.floor(items.length / 8);
    if (this.mappedInscriptions.length % 8 > 0) { pages += 1; }
    this.pagination = [...Array(pages).keys()];
    this.paginate(0);
  };

  paginate = (page: number) => {
    this.currentPage = page;
    const start = (8 * page);
    const elements = 8;
    const pagedItems: IInscription[] = [...this.mappedInscriptions];
    this.paginatedInscriptions = pagedItems.splice(start, elements);
  };

  previewsPage = () => {
    if (this.currentPage > 0) {
      this.paginate(this.currentPage - 1);
    }
  };

  nextPage = () => {
    if (this.currentPage < this.pagination.length - 1) {
      this.paginate(this.currentPage + 1);
    }
  };
}
