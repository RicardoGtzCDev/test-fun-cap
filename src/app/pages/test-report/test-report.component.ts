import {
  Component, inject,
} from '@angular/core';
import { TestReportService } from 'src/app/core/api/test-report.service';
import { CoreModule } from 'src/app/core/core.module';
import { CourseCardComponent } from 'src/app/shared/components/course-card/course-card.component';
import { InscriptionsFilterComponent } from 'src/app/shared/components/inscriptions-filter/inscriptions-filter.component';
import { PaginatorComponent } from 'src/app/shared/components/paginator/paginator.component';
import { UserHeaderComponent } from 'src/app/shared/components/user-header/user-header.component';
import { TestReportStoreService } from 'src/app/shared/services/test-report-store.service';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: [],
  standalone: true,
  imports: [
    CoreModule,
    UserHeaderComponent,
    InscriptionsFilterComponent,
    CourseCardComponent,
    PaginatorComponent],
})
export class TestReportComponent {
  private testReportService = inject(TestReportService);
  private testReportStore = inject(TestReportStoreService);

  public get paginatedInscriptions() {
    return this.testReportStore.paginatedInscriptions.asReadonly();
  }

  constructor() {
    this.testReportService.getTestReport().subscribe({
      next: (response) => {
        this.testReportStore.email.set(response.email);
        this.testReportStore.user.set(response.people[0]);
        this.testReportStore.inscriptions.set(response.inscriptions);
      },
      error: () => { },
    });
  }
}
