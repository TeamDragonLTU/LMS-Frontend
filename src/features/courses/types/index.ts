export interface ICourse {
  id: string;
  name: string;
  description: string;
  startDate: string;
}

export interface ICourseLoader {
  course: ICourse;
}
