import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//
import { API_URL } from 'src/app/core/constants';
import { ITestReport } from 'src/app/shared/models/test-report';

@Injectable({
  providedIn: 'root',
})
export class TestReportService {
  constructor(
    private http: HttpClient,
  ) { }

  getTestReport = () => (
    this.http.get<ITestReport>(API_URL)
  );
}
