import { Component } from '@angular/core';
import { TestReportService } from 'src/app/core/api/test-report.service';
import { ITestReport } from 'src/app/shared/models/test-report';

@Component({
  selector: 'app-root',
  template: `
    {{testReport| json}}
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  title = 'funCS-front';
  testReport!: ITestReport;

  constructor(
    private testReportService: TestReportService,
  ) {
    this.testReportService.getTestReport().subscribe({
      next: (response) => { this.testReport = response; },
    });
  }
}
