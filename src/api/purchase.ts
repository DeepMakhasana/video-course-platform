import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetPurchasedCourseList() {
  const URL = `${endpoints.course.purchasedCourses}/list`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  console.log(data);

  const memoizedValue = useMemo(
    () => ({
      purchasedCourses: data?.trainerCourseIdList || [],
      purchasedCoursesLoading: isLoading,
      purchasedCoursesError: error,
      purchasedCoursesValidating: isValidating,
      purchasedCoursesMutate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}
