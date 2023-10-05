import { Component, Input } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { IInscription } from 'src/app/shared/models/test-report';
import { TruncatePipe } from 'src/app/shared/pipes/truncate.pipe';

@Component({
  selector: 'app-course-card',
  standalone: true,
  imports: [CoreModule, TruncatePipe],
  templateUrl: './course-card.component.html',
  styles: [
  ],
})
export class CourseCardComponent {
  @Input() course!: IInscription;
  constructor() { }
}
