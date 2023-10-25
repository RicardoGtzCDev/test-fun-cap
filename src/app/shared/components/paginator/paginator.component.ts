import {
  Component, EventEmitter, Output, WritableSignal, effect, inject, signal,
} from '@angular/core';
import { ELEMENTS_PER_PAGE } from 'src/app/core/constants';
import { CoreModule } from 'src/app/core/core.module';
import { IInscription } from 'src/app/shared/models/test-report';
import { TestReportStoreService } from 'src/app/shared/services/test-report-store.service';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './paginator.component.html',
  styles: [
  ],
})
export class PaginatorComponent {
  private testReportStore = inject(TestReportStoreService);

  public get pagination() { return this.testReportStore.pagination; }

  @Output() paginatedInscriptions = new EventEmitter<IInscription[]>();

  currentPage: WritableSignal<number> = signal(1);

  constructor() {
    effect(() => {
      console.log('paginate', this.testReportStore.mappedInscriptions().length);
      this.paginate(0);
    }, { allowSignalWrites: true });
  }

  paginate = (page: number) => {
    this.currentPage.set(page);
    const start = (ELEMENTS_PER_PAGE * page);
    this.testReportStore.paginatedInscriptions.set(
      [...this.testReportStore.mappedInscriptions()]
        .splice(start, ELEMENTS_PER_PAGE),
    );
  };

  previewsPage = () => {
    if (this.currentPage() > 0) {
      this.paginate(this.currentPage() - 1);
    }
  };

  nextPage = () => {
    if (this.currentPage() < this.testReportStore.pagination().length - 1) {
      this.paginate(this.currentPage() + 1);
    }
  };
}
