import { Box, Card, Grid, Button, Typography, CardContent } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetPurchasedCourses } from 'src/api/course';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function PurchaseCourseList() {
  const { purchasedCourses } = useGetPurchasedCourses();
  return (
    <>
      <CustomBreadcrumbs
        heading="Course"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Courses' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Grid container>
        {purchasedCourses.map((course: any) => (
          <Grid item key={course.id} xs={4}>
            <CourseCard course={course.course} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Card sx={{ m: '0.5rem' }}>
      <CardContent>
        <Box sx={{ height: '200px', borderRadius: '10px' }}>
          <img
            src={`https://transfry.s3.ap-south-1.amazonaws.com/${course.coverImage}`}
            alt={course.title}
            style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: '10px' }}
          />
        </Box>
        <Typography component="h2" variant="h5" sx={{ py: '1rem' }}>
          {course?.title}
        </Typography>
        <Typography component="p" variant="body1">
          {`${course?.description.substring(100)}...`}
        </Typography>
        <Button
          component={RouterLink}
          href={`/dashboard/courses/learning/${course?.id}`}
          variant="outlined"
          sx={{ mt: '1rem' }}
        >
          Start Learning
        </Button>
      </CardContent>
    </Card>
  );
}
