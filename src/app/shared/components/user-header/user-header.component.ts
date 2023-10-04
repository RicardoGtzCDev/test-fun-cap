import {
  Component, Input, OnChanges, SimpleChanges,
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
export class UserHeaderComponent implements OnChanges {
  @Input() email!: string;
  @Input() user!: IPerson;
  initials: string = '';
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      const newValue: IPerson = changes['user'].currentValue;
      const oldValue: IPerson = changes['user'].previousValue;
      if (newValue !== oldValue) {
        this.initials = `${this.user.name.charAt(0)}${this.user.lastName.charAt(0)}`;
      }
    }
  }
}
