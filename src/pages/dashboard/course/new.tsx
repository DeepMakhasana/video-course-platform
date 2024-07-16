import { Helmet } from 'react-helmet-async';

import CourseCreateView from 'src/sections/overview/course/view/course-create-view';

// ----------------------------------------------------------------------

export default function CourseCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: E-Commerce</title>
      </Helmet>

      <CourseCreateView />
    </>
  );
}
