import {
  Component, computed, Signal, inject, effect,
} from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { FormControl } from '@angular/forms';
import { ELEMENTS_PER_PAGE, ORDER_OPTIONS, PROGRESS_OPTIONS } from 'src/app/core/constants';
import { IInscription } from 'src/app/shared/models/test-report';
import { TestReportStoreService } from 'src/app/shared/services/test-report-store.service';

@Component({
  selector: 'app-inscriptions-filter',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './inscriptions-filter.component.html',
  styles: [
  ],
})
export class InscriptionsFilterComponent {
  private testReportStore = inject(TestReportStoreService);

  orderByOptions: string[] = ORDER_OPTIONS;

  selectedOrder = new FormControl('');
  selectedSector = new FormControl('');
  selectedProgress = new FormControl('');
  searchName = new FormControl('');

  sectorOptions: Signal<string[]> = computed(() => [...new Set(
    this.testReportStore.inscriptions().map((value) => (value.course.sector.name)),
  )]
    .sort((a, b) => {
      if (a < b) { return -1; }
      if (a > b) { return 1; }
      return 0;
    }));
  progressOptions: Signal<string[]> = computed(() => [...new Set(
    this.testReportStore.inscriptions().map((value) => {
      if (value.advance === 0) { return PROGRESS_OPTIONS[0]; }
      if (value.advance === 100) { return PROGRESS_OPTIONS[2]; }
      return PROGRESS_OPTIONS[1];
    }),
  )]);

  filteredInscriptions: IInscription[] = [];

  constructor() {
    effect(() => {
      console.log('filter', this.testReportStore.inscriptions().length);
      this.resetForms();
    }, { allowSignalWrites: true });
  }

  filter = () => {
    let filteredItems: IInscription[] = [];
    const filterSector = this.selectedSector.getRawValue();
    const filterProgress = this.selectedProgress.getRawValue();
    if (filterSector && filterProgress) {
      filteredItems = this.filterBy('sector', this.testReportStore.inscriptions(), filterSector);
      filteredItems = this.filterBy('progress', filteredItems, filterProgress);
    } else if (filterSector) {
      filteredItems = this.filterBy('sector', this.testReportStore.inscriptions(), filterSector);
    } else if (filterProgress) {
      filteredItems = this.filterBy('progress', this.testReportStore.inscriptions(), filterProgress);
    } else {
      filteredItems = this.testReportStore.inscriptions();
    }
    this.filteredInscriptions = filteredItems;
    return filteredItems;
  };

  filterBy = (by: string, items: IInscription[], filter: string) => {
    let filteredItems: IInscription[] = [];
    switch (by) {
      case 'sector':
        filteredItems = items.filter((item) => item.course.sector.name === filter);
        break;
      case 'progress':
        if (filter === PROGRESS_OPTIONS[0]) {
          filteredItems = items.filter((item) => item.advance === 0);
        } else if (filter === PROGRESS_OPTIONS[2]) {
          filteredItems = items.filter((item) => item.advance === 100);
        } else {
          filteredItems = items.filter((item) => item.advance !== 0 && item.advance !== 100);
        }
        break;
      default:
        filteredItems = items;
        break;
    }
    return filteredItems;
  };

  orderBy = (by: string) => {
    let orderedItems: IInscription[] = [];
    switch (by) {
      case 'Nombre (A-Z)':
        orderedItems = this.filteredInscriptions.sort((a, b) => {
          if (a.course.name < b.course.name) { return -1; }
          if (a.course.name > b.course.name) { return 1; }
          return 0;
        });
        break;
      case 'Nombre (Z-A)':
        orderedItems = this.filteredInscriptions.sort((a, b) => {
          if (b.course.name < a.course.name) { return -1; }
          if (b.course.name > a.course.name) { return 1; }
          return 0;
        });
        break;
      case 'Avance (0-100)':
        orderedItems = this.filteredInscriptions.sort((a, b) => a.advance - b.advance);
        break;
      case 'Avance (100-0)':
        orderedItems = this.filteredInscriptions.sort((a, b) => b.advance - a.advance);
        break;
      case 'Fecha de Inscripción':
        orderedItems = this.filteredInscriptions.sort((a, b) => {
          if (a.inscripcionDate < b.inscripcionDate) { return -1; }
          if (a.inscripcionDate > b.inscripcionDate) { return 1; }
          return 0;
        });
        break;
      default:
        orderedItems = this.filteredInscriptions;
        break;
    }
    return orderedItems;
  };

  emit = (updatedInscriptions: IInscription[]) => {
    this.testReportStore.mappedInscriptions.set(updatedInscriptions);
    let pages = Math.floor(updatedInscriptions.length / ELEMENTS_PER_PAGE);
    if (updatedInscriptions.length % ELEMENTS_PER_PAGE > 0) { pages += 1; }
    this.testReportStore.pagination.set([...Array(pages).keys()]);
  };

  orderByAndEmit = (by: string) => {
    const orderedItems = this.orderBy(by);
    this.emit(orderedItems);
  };

  filterByAndEmit = () => {
    this.searchName.patchValue('');
    const orderBy = this.selectedOrder.getRawValue();
    const filteredInscriptions = this.filter();
    if (orderBy) {
      this.orderByAndEmit(orderBy);
    } else {
      this.emit(filteredInscriptions);
    }
  };

  searchByName = () => {
    let filteredItems: IInscription[] = [];
    const orderBy = this.selectedOrder.getRawValue();
    const name = this.searchName.getRawValue();
    this.filter();
    if (name) {
      filteredItems = this.filteredInscriptions
        .filter((item) => item.course.name.toLowerCase().includes(name.toLowerCase()));
      this.filteredInscriptions = filteredItems;
    } else {
      filteredItems = this.filteredInscriptions;
    }
    if (orderBy) {
      this.orderByAndEmit(orderBy);
    } else {
      this.emit(filteredItems);
    }
  };

  resetForms = () => {
    this.filteredInscriptions = this.testReportStore.inscriptions();
    this.searchName.patchValue('');
    this.selectedOrder.patchValue('');
    this.selectedSector.patchValue('');
    this.selectedProgress.patchValue('');
    this.emit(this.testReportStore.inscriptions());
  };
}
