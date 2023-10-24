import {
  Component, Input, Signal, WritableSignal, computed,
} from '@angular/core';
import { IPerson } from 'src/app/shared/models/test-report';
import { CoreModule } from 'src/app/core/core.module';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [CoreModule],
  templateUrl: './user-header.component.html',
  styles: [
  ],
})
export class UserHeaderComponent {
  @Input() email!: WritableSignal<string>;
  @Input() user!: WritableSignal<IPerson>;
  initials: Signal<string> = computed(() => `${this.user().name.charAt(0)}${this.user().lastName.charAt(0)}`);
  constructor() { }
}
