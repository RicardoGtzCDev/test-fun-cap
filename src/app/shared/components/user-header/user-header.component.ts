import {
  Component, Signal, computed, inject,
} from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { TestReportStoreService } from 'src/app/shared/services/test-report-store.service';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './user-header.component.html',
  styles: [
  ],
})
export class UserHeaderComponent {
  private testReportStore = inject(TestReportStoreService);

  public get email() { return this.testReportStore.email; }
  public get user() { return this.testReportStore.user; }

  initials: Signal<string> = computed(() => `${this.testReportStore.user().name.charAt(0)}${this.testReportStore.user().lastName.charAt(0)}`);
  constructor() {}
}
