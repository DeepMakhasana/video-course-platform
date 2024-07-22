import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

import { useGetCoursesById } from 'src/api/course';

import { SplashScreen } from 'src/components/loading-screen';

import PurchaseCourseDetailView from 'src/sections/learner-overview/course/learning/view/purchase-course-detail-view';

// ----------------------------------------------------------------------

export default function PurchaseCoursePage() {
  const param = useParams();
  console.log('id: ', param.id);
  const { course, courseLoading } = useGetCoursesById(Number(param.id));
  console.log(course);
  return (
    <>
      <Helmet>
        <title> Dashboard: Course learning</title>
      </Helmet>
      {courseLoading ? <SplashScreen /> : <PurchaseCourseDetailView course={course} />}
    </>
  );
}
