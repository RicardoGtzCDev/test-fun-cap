import {
  Component, EventEmitter, Input, OnChanges, Output, SimpleChanges,
} from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { FormControl } from '@angular/forms';
import { ORDER_OPTIONS } from 'src/app/core/constants';
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
  selectedCategory = new FormControl('');
  selectedProgress = new FormControl('');

  sectors: string[] = [];

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['inscriptions']) {
      const newValue: IInscription[] = changes['inscriptions'].currentValue;
      const oldValue: IInscription[] = changes['inscriptions'].previousValue;
      if (newValue !== oldValue) {
        this.sectors = [...new Set(
          newValue.map((value) => (value.course.sector.name)),
        )]
          .sort((a, b) => {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
          });
      }
    }
  }

  orderBy = (by: string) => {
    let orderedItems: IInscription[] = [];
    switch (by) {
      case 'Nombre (A-Z)':
        orderedItems = this.inscriptions.sort((a, b) => {
          if (a.course.name < b.course.name) { return -1; }
          if (a.course.name > b.course.name) { return 1; }
          return 0;
        });
        break;
      case 'Nombre (Z-A)':
        orderedItems = this.inscriptions.sort((a, b) => {
          if (b.course.name < a.course.name) { return -1; }
          if (b.course.name > a.course.name) { return 1; }
          return 0;
        });
        break;
      case 'Avance (0-100)':
        orderedItems = this.inscriptions.sort((a, b) => a.advance - b.advance);
        break;
      case 'Avance (100-0)':
        orderedItems = this.inscriptions.sort((a, b) => b.advance - a.advance);
        break;
      case 'Fecha de Inscripción':
        orderedItems = this.inscriptions.sort((a, b) => {
          if (a.inscripcionDate < b.inscripcionDate) { return -1; }
          if (a.inscripcionDate > b.inscripcionDate) { return 1; }
          return 0;
        });
        break;
      default:
        orderedItems = this.inscriptions;
        break;
    }
    return orderedItems;
  };

  emit = (updatedInscriptions: IInscription[]) => {
    this.mappedInscriptions.emit(updatedInscriptions);
  };

  filterBy = () => {
    // cuando cualquiera de los 2 selects cambia de valor
    // se tiene que llamar esta funcion, tomar el valor de
    // ambos FormControls y proceder a hacer albos filtrados
    // al terminar de filtrar se llama la función orderByAndEmit
  };

  orderByAndEmit = (by:string) => {
    const orderedItems = this.orderBy(by);
    this.emit(orderedItems);
  };
}
