import useSWR from 'swr';
import { useMemo, useState, useCallback } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

import { ICourseType } from 'src/types/course';

// ----------------------------------------------------------------------

export function useGetCourses() {
  const URL = endpoints.course.list;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      courses: (data?.courses as ICourseType[]) || [],
      coursesLoading: isLoading,
      coursesError: error,
      coursesValidating: isValidating,
      coursesEmpty: !isLoading && !data?.courses.length,
      coursesMutate: mutate,
    }),
    [data?.courses, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCoursesById(id: number) {
  const URL = `${endpoints.course.details}/${id}`;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      course: (data?.course as ICourseType[]) || [],
      courseLoading: isLoading,
      courseError: error,
      courseValidating: isValidating,
      courseEmpty: !isLoading && !data?.course.length,
    }),
    [data?.course, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCoursesPlaylistVideos(playlistId: string) {
  const URL = `${endpoints.course.playlist}?playlistId=${playlistId}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      playlist: data?.playlistVideos || [],
      playlistLoading: isLoading,
      playlistError: error,
      playlistValidating: isValidating,
      playlistEmpty: !isLoading && !data?.playlistVideos.length,
      playlistMutate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCoursesModules(id: number) {
  const URL = `${endpoints.course.module}/${id}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      modules: data?.modules || [],
      modulesLoading: isLoading,
      modulesError: error,
      modulesValidating: isValidating,
      modulesEmpty: !isLoading && !data?.modules.length,
      modulesMutate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetCoursesModuleWithTopic(id: number) {
  const URL = `${endpoints.course.moduleWithTopic}/${id}`;

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      modulesWithTopics: data || [],
      modulesWithTopicsLoading: isLoading,
      modulesWithTopicsError: error,
      modulesWithTopicsValidating: isValidating,
      modulesWithTopicsMutate: mutate,
    }),
    [data, error, isLoading, isValidating, mutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useCreateCourse() {
  const URL = endpoints.course.create;

  const courseCreateMutate = useCallback(
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
      courseCreateMutate,
    }),
    [courseCreateMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useCreateModule() {
  const URL = endpoints.course.module;

  const moduleCreateMutate = useCallback(
    async (payload: any) => {
      const { data, status } = await axiosInstance.post(URL, payload);

      if (status === 200) {
        return data;
      }
      console.log('error while creating module: ', data);
      return false;
    },
    [URL]
  );

  const memoizedValue = useMemo(
    () => ({
      moduleCreateMutate,
    }),
    [moduleCreateMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useCreateTopic() {
  const [isLoading, setIsLoading] = useState(false);
  const URL = endpoints.course.topic;

  const topicCreateMutate = useCallback(
    async (payload: any) => {
      setIsLoading(true);
      const { data, status } = await axiosInstance.post(URL, payload);

      if (status === 200) {
        setIsLoading(false);
        return data;
      }
      console.log('error while creating topic: ', data);
      setIsLoading(false);
      return false;
    },
    [URL]
  );

  const memoizedValue = useMemo(
    () => ({
      topicCreateMutate,
      topicCreateLoading: isLoading,
    }),
    [topicCreateMutate, isLoading]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useEditCourse() {
  const courseEditMutate = useCallback(async (id: number, payload: any) => {
    const URL = `${endpoints.course.create}/${id}`;
    const { data, status } = await axiosInstance.put(URL, payload);

    if (status === 200) {
      return data;
    }
    console.log('error while editing course: ', data);
    return false;
  }, []);

  const memoizedValue = useMemo(
    () => ({
      courseEditMutate,
    }),
    [courseEditMutate]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useDeleteCourse() {
  const courseDeleteMutate = useCallback(async (id: number) => {
    const URL = `${endpoints.course.create}/${id}`;
    const { data, status } = await axiosInstance.delete(URL);

    if (status === 200) {
      return data;
    }
    console.log('error while deleting course: ', data);
    return false;
  }, []);

  const memoizedValue = useMemo(
    () => ({
      courseDeleteMutate,
    }),
    [courseDeleteMutate]
  );

  return memoizedValue;
}
