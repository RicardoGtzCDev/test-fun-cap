import { Injectable, WritableSignal, signal } from '@angular/core';
import { IInscription, IPerson } from 'src/app/shared/models/test-report';

@Injectable({
  providedIn: 'root',
})
export class TestReportStoreService {
  email: WritableSignal<string> = signal('');
  user: WritableSignal<IPerson> = signal<IPerson>({
    lastName: '',
    name: '',
  });
  inscriptions: WritableSignal<IInscription[]> = signal<IInscription[]>([]);
  mappedInscriptions: WritableSignal<IInscription[]> = signal<IInscription[]>([]);
  pagination: WritableSignal<number[]> = signal<number[]>([]);
  paginatedInscriptions: WritableSignal<IInscription[]> = signal<IInscription[]>([]);
  constructor() { }
}
