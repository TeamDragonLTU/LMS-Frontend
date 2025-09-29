export interface ICourse {
  id: string;
  name: string;
  description: string;
  startDate: string;
}

export interface ICoursesLoader {
  courses: Promise<ICourse[]>;
}
export interface ICourseLoader {
  course: ICourse;
}
