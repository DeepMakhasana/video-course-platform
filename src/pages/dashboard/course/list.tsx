import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import { OverviewCourseView } from 'src/sections/overview/course/view';
import OverviewLearnerCourseView from 'src/sections/learner-overview/course/view/overview-course-view';

// ----------------------------------------------------------------------

export default function OverviewCoursePage() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> Dashboard: E-Commerce</title>
      </Helmet>

      {user?.role === 'trainer' ? <OverviewCourseView /> : <OverviewLearnerCourseView />}
    </>
  );
}
