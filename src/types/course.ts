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
