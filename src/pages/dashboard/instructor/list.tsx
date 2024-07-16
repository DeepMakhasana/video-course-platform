import { Helmet } from 'react-helmet-async';

import OverviewInstructorView from 'src/sections/overview/instructor/view/overview-instructor-view';

// ----------------------------------------------------------------------

export default function OverviewInstructorPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Instructor</title>
      </Helmet>

      <OverviewInstructorView />
    </>
  );
}
