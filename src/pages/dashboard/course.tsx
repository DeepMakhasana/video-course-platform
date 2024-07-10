import { Helmet } from 'react-helmet-async';

import { OverviewCourseView } from 'src/sections/overview/course/view';

// ----------------------------------------------------------------------

export default function OverviewCoursePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: E-Commerce</title>
      </Helmet>

      <OverviewCourseView />
    </>
  );
}
