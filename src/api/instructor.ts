import useSWR from 'swr';
import { useMemo, useCallback } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { InstructorType } from 'src/types/instructor';

export function useGetInstructor() {
  const URL = endpoints.instructor.root;
  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memorizedValue = useMemo(
    () => ({
      instructors: (data?.instructors as InstructorType[]) || [],
      instructorsLoading: isLoading,
      instructorsError: error,
      instructorsValidation: isValidating,
      instructorsMutate: mutate,
    }),
    [data?.instructors, isLoading, error, isValidating, mutate]
  );

  return memorizedValue;
}

// ----------------------------------------------------------------------

export function useCreateInstructor() {
  const URL = endpoints.instructor.root;

  const instructorCreateMutate = useCallback(
    async (payload: any) => {
      const { data, status } = await axiosInstance.post(URL, payload);

      if (status === 200) {
        return data;
      }
      console.log('error while creating course: ', data);
      return false;
    },
    [URL]
  );

  const memoizedValue = useMemo(
    () => ({
      instructorCreateMutate,
    }),
    [instructorCreateMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useEditInstructor() {
  const instructorEditMutate = useCallback(async (id: number, payload: any) => {
    const URL = `${endpoints.instructor.root}/${id}`;
    const { data, status } = await axiosInstance.put(URL, payload);

    if (status === 200) {
      return data;
    }
    console.log('error while editing course: ', data);
    return false;
  }, []);

  const memoizedValue = useMemo(
    () => ({
      instructorEditMutate,
    }),
    [instructorEditMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useDeleteInstructor() {
  const instructorDeleteMutate = useCallback(async (id: number) => {
    const URL = `${endpoints.instructor.root}/${id}`;
    const { data, status } = await axiosInstance.delete(URL);

    if (status === 200) {
      return data;
    }
    console.log('error while deleting course: ', data);
    return false;
  }, []);

  const memoizedValue = useMemo(
    () => ({
      instructorDeleteMutate,
    }),
    [instructorDeleteMutate]
  );

  return memoizedValue;
}
