import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Tooltip,
  Container,
  CardHeader,
  Typography,
  IconButton,
  CardContent,
  FormHelperText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { s3ImageUploader } from 'src/utils/s3-files-handler';

import { useGetInstructor } from 'src/api/instructor';
import { useEditCourse, useCreateCourse } from 'src/api/course';

import Iconify from 'src/components/iconify';
import { Upload } from 'src/components/upload';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

import { InstructorType } from 'src/types/instructor';

export interface EditCourseProp {
  id: number;
  title: string;
  playlist: string;
  description: string;
  benefits: string;
  coverImage: string;
  materials: string;
  price: number | string;
  status: string;
  timeDurationDay: number | string;
  trainerId: number | string;
  instructorId: number | string;
}
// ----------------------------------------------------------------------

export default function CourseCreateView({ editCourse }: { editCourse?: any }) {
  const settings = useSettingsContext();
  const { instructors, instructorsLoading } = useGetInstructor();
  const [isLoading, setIsLoading] = useState(false);
  const [inputFile, setInputFile] = useState<File | string | null>(editCourse?.coverImage || null);
  const router = useRouter();

  console.log(instructors, instructorsLoading);

  const { enqueueSnackbar } = useSnackbar();

  const { courseCreateMutate } = useCreateCourse();
  const { courseEditMutate } = useEditCourse();

  const defaultValues = useMemo(
    () => ({
      title: (editCourse?.title as string) || '',
      playlist: editCourse?.playlist
        ? `https://youtube.com/playlist?list=${editCourse?.playlist}`
        : '',
      description: (editCourse?.description as string) || '',
      benefits: (editCourse?.benefits as string) || '',
      materials: (editCourse?.materials as string) || '',
      instructorId: (editCourse?.instructorId as string) || '',
      status: (editCourse?.status as string) || '',
      price: (editCourse?.price as string) || '',
      timeDurationDay: (editCourse?.timeDurationDay as string) || '',
      coverImage: '',
    }),
    [editCourse]
  );

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    playlist: Yup.string().url('Enter valid playlist url').required('Email is required'),
    description: Yup.string().required('Description is required'),
    benefits: Yup.string().required('Benefits is required'),
    materials: Yup.string().required('Materials is required'),
    instructorId: Yup.string().required('Instructor selection is required'),
    status: Yup.string().required('Status is required'),
    price: Yup.string().required('Price is required'),
    timeDurationDay: Yup.string().required('Course duration is required'),
    coverImage: Yup.mixed<any>().nullable().required('Course cover images is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    control,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('coverImage', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handelEditDelete = () => {
    setInputFile('');
  };

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log('data', data);
      setIsLoading(true);

      let done = false;

      if (editCourse) {
        if (data.coverImage) {
          const newCoverImage = Date.now() + data.coverImage.name;

          const payload = { ...data, coverImage: newCoverImage };

          const res = await courseEditMutate(editCourse.id, payload);

          if (res) {
            done = await s3ImageUploader({
              Key: newCoverImage,
              Body: data.coverImage,
            });
          }
        } else {
          const payload = { ...data, coverImage: editCourse.coverImage };
          done = await courseEditMutate(editCourse.id, payload);
        }
      } else if (data.coverImage) {
        const newCoverImage = Date.now() + data.coverImage.name;

        const payload = { ...data, coverImage: newCoverImage };

        const res = await courseCreateMutate(payload);

        if (res) {
          done = await s3ImageUploader({
            Key: newCoverImage,
            Body: data.coverImage,
          });
        }
      } else {
        enqueueSnackbar('Upload course cover image.', { variant: 'error' });
      }

      console.log('done', done);

      if (done) {
        setIsLoading(false);
        enqueueSnackbar(editCourse ? 'Course edit successfully!' : 'Course created successfully!');
        reset();
        router.push(paths.dashboard.courses.root);
      } else {
        setIsLoading(false);
        enqueueSnackbar('Fail to create!');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={editCourse ? 'Edit Course' : 'Course'}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Courses', href: paths.dashboard.courses.root },
          { name: 'Create' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Box>
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="title" label="Course title" />
            <RHFTextField name="playlist" label="YouTube playlist" />
            <RHFTextField name="description" multiline rows={4} label="Description" />
            <RHFTextField name="benefits" multiline rows={4} label="Benefits" />
            <RHFTextField name="materials" multiline rows={4} label="Materials" />

            <RHFSelect native name="status" label="Status" InputLabelProps={{ shrink: true }}>
              <option value="">Select Status</option>
              {[
                { id: 1, label: 'Live' },
                { id: 2, label: 'Processing' },
              ].map((status) => (
                <option key={status.id} value={status.label}>
                  {status.label}
                </option>
              ))}
            </RHFSelect>

            {instructorsLoading ? (
              <Typography>Loading...</Typography>
            ) : (
              <RHFSelect
                native
                name="instructorId"
                label="Instructor"
                InputLabelProps={{ shrink: true }}
              >
                <option value="">Select Instructor</option>
                {instructors?.map((instructor: InstructorType) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </RHFSelect>
            )}

            <RHFTextField name="price" label="Price" />

            <Card>
              <CardHeader title="Upload Single File" />
              <CardContent>
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Upload
                        error={!!error}
                        file={field.value}
                        maxSize={3145728}
                        onDrop={handleDrop}
                        onDelete={() => setValue('coverImage', null)}
                      />

                      {!!error && (
                        <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                          {error.message}
                        </FormHelperText>
                      )}
                    </div>
                  )}
                />
                {inputFile && (
                  <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', pt: '1rem' }}>
                    <Box
                      sx={{
                        width: 'auto',
                        height: '100px',
                        mt: '1rem',
                      }}
                    >
                      <img
                        src={`https://transfry.s3.ap-south-1.amazonaws.com/${editCourse.coverImage}`}
                        alt="previous upload"
                        style={{ width: '200px' }}
                      />
                    </Box>
                    <Tooltip title="Delete" onClick={handelEditDelete}>
                      <IconButton color="primary">
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </CardContent>
            </Card>

            <RHFTextField name="timeDurationDay" label="Duration" />

            <LoadingButton
              type="submit"
              variant="contained"
              size="large"
              loading={isSubmitting || isLoading}
              sx={{ ml: 2 }}
            >
              {isSubmitting || isLoading
                ? `Course ${editCourse ? 'editing..' : 'creating..'}`
                : `${editCourse ? 'Edit' : 'Create'} Course`}
            </LoadingButton>
          </Box>
        </FormProvider>
      </Box>
    </Container>
  );
}
