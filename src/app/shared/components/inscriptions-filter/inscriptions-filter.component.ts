import {
  Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { FormControl } from '@angular/forms';
import { ORDER_OPTIONS, PROGRESS_OPTIONS } from 'src/app/core/constants';
import { IInscription } from 'src/app/shared/models/test-report';

@Component({
  selector: 'app-inscriptions-filter',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './inscriptions-filter.component.html',
  styles: [
  ],
})
export class InscriptionsFilterComponent implements OnChanges {
  @Input() inscriptions: IInscription[] = [];
  @Output() mappedInscriptions = new EventEmitter<IInscription[]>();

  orderByOptions: string[] = ORDER_OPTIONS;

  selectedOrder = new FormControl('');
  selectedSector = new FormControl('');
  selectedProgress = new FormControl('');
  searchName = new FormControl('');

  sectorOptions: string[] = [];
  progressOptions: string[] = [];

  filteredInscriptions: IInscription[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inscriptions']) {
      const newValue: IInscription[] = changes['inscriptions'].currentValue;
      const oldValue: IInscription[] = changes['inscriptions'].previousValue;
      if (newValue !== oldValue) {
        this.sectorOptions = [...new Set(
          newValue.map((value) => (value.course.sector.name)),
        )]
          .sort((a, b) => {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
          });

        this.progressOptions = [...new Set(
          newValue.map((value) => {
            if (value.advance === 0) { return PROGRESS_OPTIONS[0]; }
            if (value.advance === 100) { return PROGRESS_OPTIONS[2]; }
            return PROGRESS_OPTIONS[1];
          }),
        )];
        this.filteredInscriptions = newValue;
      }
    }
  }

  filter = () => {
    let filteredItems: IInscription[] = [];
    const filterSector = this.selectedSector.getRawValue();
    const filterProgress = this.selectedProgress.getRawValue();
    if (filterSector && filterProgress) {
      filteredItems = this.filterBy('sector', this.inscriptions, filterSector);
      filteredItems = this.filterBy('progress', filteredItems, filterProgress);
    } else if (filterSector) {
      filteredItems = this.filterBy('sector', this.inscriptions, filterSector);
    } else if (filterProgress) {
      filteredItems = this.filterBy('sector', this.inscriptions, filterProgress);
    } else {
      filteredItems = this.inscriptions;
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
        if (filter === 'Sin Iniciar') {
          filteredItems = items.filter((item) => item.advance === 0);
        } else if (filter === 'Finalizado') {
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
    this.mappedInscriptions.emit(updatedInscriptions);
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
    this.filteredInscriptions = this.inscriptions;
    this.searchName.patchValue('');
    this.selectedOrder.patchValue('');
    this.selectedSector.patchValue('');
    this.selectedProgress.patchValue('');
    this.emit(this.inscriptions);
  };
}
