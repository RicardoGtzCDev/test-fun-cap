export interface ITestReport {
  email: string;
  inscriptions: IInscription[];
  people: IPerson[];
}

export interface IInscription {
  advance: number;
  anyTest: boolean;
  certificationDate: Date;
  course: Course;
  courseId: number;
  folioCertificate: string;
  inscripcionDate: Date;
  reactionId?: number;
  scoreCourse: number;
}

export interface Course {
  imageUrl: string;
  name: string;
  sector: Sector;
}

export interface Sector {
  colorTheme: string;
  id: number;
  name: string;
}

export interface IPerson {
  lastName: string;
  name: string;
}
