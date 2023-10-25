// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
// import { API_URL } from 'src/app/core/constants';
import { ITestReport } from 'src/app/shared/models/test-report';
//
import * as data from 'src/app/core/api/data.json';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TestReportService {
  // private http = inject(HttpClient);

  constructor() { }

  getTestReport = () => (
    from(new Promise<ITestReport>((resolve) => {
      const lala: ITestReport = JSON.parse(JSON.stringify(data));
      resolve(lala);
    }))
  );
}
