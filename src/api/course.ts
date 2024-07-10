import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

import { ICourseType } from 'src/types/course';

// ----------------------------------------------------------------------

export function useGetCourses() {
  const URL = endpoints.course.list;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      courses: (data?.courses as ICourseType[]) || [],
      coursesLoading: isLoading,
      coursesError: error,
      coursesValidating: isValidating,
      coursesEmpty: !isLoading && !data?.courses.length,
    }),
    [data?.courses, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------
