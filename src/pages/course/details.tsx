import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import CourseDetailView from 'src/sections/course/course-detail-view';

// ----------------------------------------------------------------------

export default function CourseDetailsPage() {
  const { id } = useParams();

  return (
    <>
      <Helmet>
        <title> Course: Details</title>
      </Helmet>

      <CourseDetailView id={Number(id)} />
    </>
  );
}
