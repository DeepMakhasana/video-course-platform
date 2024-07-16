import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { useGetCoursesById } from 'src/api/course';

import CourseCurriculumView from 'src/sections/overview/course/view/course-curriculum-view';

// ----------------------------------------------------------------------

export default function CourseCurriculumPage() {
  const searchParam = useParams();
  const data = useGetCoursesById(Number(searchParam.id) || 0);
  return (
    <>
      <Helmet>
        <title> Dashboard: Course curriculum</title>
      </Helmet>

      <CourseCurriculumView course={data.course} />
    </>
  );
}
