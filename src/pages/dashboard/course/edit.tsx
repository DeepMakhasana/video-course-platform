import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { useGetCoursesById } from 'src/api/course';

import { SplashScreen } from 'src/components/loading-screen';

import CourseCreateView from 'src/sections/overview/course/view/course-create-view';

// ----------------------------------------------------------------------

export default function CourseEditPage() {
  const param = useParams();
  console.log('id: ', param.id);
  const { course, courseLoading } = useGetCoursesById(Number(param.id));
  console.log(course);
  return (
    <>
      <Helmet>
        <title> Dashboard: E-Commerce</title>
      </Helmet>
      {courseLoading ? <SplashScreen /> : <CourseCreateView editCourse={course} />}
    </>
  );
}
