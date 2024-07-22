export interface ICourseType {
  id: number;
  title: string;
  timeDurationDay: number;
  price: number;
  description: string;
  benefits: string;
  materials: string;
  coverImage: string;
  status: string;
  instructorId: number;
  trainerId: number;
  createdAt: string;
  updatedAt: string;
  instructor: {
    name: string;
  };
}

export interface ICourseListType {
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
  title: string;
  instructor: string;
  status: string;
}
