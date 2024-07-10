export interface ICourseType {
  id: number;
  title: string;
  timeDurationDay: number;
  price: number;
  description: string;
  coverImage: string;
}

// enum CourseStatus {
//   live,
//   processing,
//   all,
// }

export interface ICourseTableFilters {
  name: string;
  instructor: string;
  status: string;
}
