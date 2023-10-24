import {
  Component, WritableSignal, inject, signal,
} from '@angular/core';
import { TestReportService } from 'src/app/core/api/test-report.service';
import { ELEMENTS_PER_PAGE } from 'src/app/core/constants';
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
  email: WritableSignal<string> = signal('');
  user: WritableSignal<IPerson> = signal<IPerson>({
    lastName: '',
    name: '',
  });
  inscriptions: WritableSignal<IInscription[]> = signal<IInscription[]>([]);

  mappedInscriptions: WritableSignal<IInscription[]> = signal<IInscription[]>([]);
  pagination: WritableSignal<number[]> = signal<number[]>([]);
  currentPage: WritableSignal<number> = signal(1);
  paginatedInscriptions: WritableSignal<IInscription[]> = signal<IInscription[]>([]);

  private testReportService = inject(TestReportService);

  constructor() {
    this.testReportService.getTestReport().subscribe({
      next: (response) => {
        this.email.set(response.email);
        this.user.set(response.people[0]);
        this.inscriptions.set(response.inscriptions);
        this.onMappedInscriptions(response.inscriptions);
      },
      error: () => { },
    });
  }

  onMappedInscriptions = (items: IInscription[]) => {
    this.mappedInscriptions.set(items);
    let pages = Math.floor(items.length / ELEMENTS_PER_PAGE);
    if (items.length % ELEMENTS_PER_PAGE > 0) { pages += 1; }
    this.pagination.set([...Array(pages).keys()]);
    this.paginate(0);
  };

  paginate = (page: number) => {
    this.currentPage.set(page);
    const start = (ELEMENTS_PER_PAGE * page);
    const pagedItems: IInscription[] = [...this.mappedInscriptions()];
    this.paginatedInscriptions.set(pagedItems.splice(start, ELEMENTS_PER_PAGE));
  };

  previewsPage = () => {
    if (this.currentPage() > 0) {
      this.paginate(this.currentPage() - 1);
    }
  };

  nextPage = () => {
    if (this.currentPage() < this.pagination().length - 1) {
      this.paginate(this.currentPage() + 1);
    }
  };
}
