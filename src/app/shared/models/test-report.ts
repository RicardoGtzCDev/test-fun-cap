export interface ITestReport {
  email: string;
  inscriptions: IInscription[];
  people: IPerson[];
}

export interface IInscription {
  advance: number;
  anyTest: boolean;
  certificationDate: Date;
  course: ICourse;
  courseId: number;
  folioCertificate: string;
  inscripcionDate: Date;
  reactionId?: number;
  scoreCourse: number;
}

export interface ICourse {
  imageUrl: string;
  name: string;
  sector: ISector;
}

export interface ISector {
  colorTheme: string;
  id: number;
  name: string;
}

export interface IPerson {
  lastName: string;
  name: string;
}
