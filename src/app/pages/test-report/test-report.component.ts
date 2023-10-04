import { Component } from '@angular/core';
import { TestReportService } from 'src/app/core/api/test-report.service';
import { CoreModule } from 'src/app/core/core.module';
import { UserHeaderComponent } from 'src/app/shared/components/user-header/user-header.component';
import { IInscription, IPerson } from 'src/app/shared/models/test-report';

@Component({
  selector: 'app-test-report',
  templateUrl: './test-report.component.html',
  styleUrls: [],
  standalone: true,
  imports: [CoreModule, UserHeaderComponent],
})
export class TestReportComponent {
  // declarations
  email : string = '';
  user!: IPerson;
  courses!: IInscription[];

  // construct
  constructor(
    private testReportService: TestReportService,
  ) {
    testReportService.getTestReport().subscribe({
      next: (response) => {
        this.email = response.email;
        [this.user] = response.people;
        this.courses = response.inscriptions;
      },
      error: () => { },
    });
  }
}
