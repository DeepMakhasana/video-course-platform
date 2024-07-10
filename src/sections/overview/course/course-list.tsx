// import { useState, useCallback } from 'react';

import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
// import { useTable } from 'src/components/table';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

// import { ICourseTableFilters } from 'src/types/course';
// import { IUserTableFilterValue } from 'src/types/user';

// const STATUS_OPTIONS = [
//   { value: 'all', label: 'All' },
//   { value: 'live', label: 'Live' },
//   { value: 'processing', label: 'Processing' },
// ];

// const TABLE_HEAD = [
//   { id: 'name', label: 'Name' },
//   { id: 'instructor', label: 'Instructor', width: 180 },
//   { id: 'status', label: 'Status', width: 100 },
//   { id: 'price', label: 'Price', width: 220 },
//   { id: 'createdAt', label: 'Created at', width: 180 },
//   { id: '', width: 88 },
// ];

// const defaultFilters: ICourseTableFilters = {
//   name: '',
//   //   role: [],
//   instructor: '',
//   status: 'all',
// };

export default function CourseList() {
  const settings = useSettingsContext();

  // const table = useTable();

  // const [filters, setFilters] = useState(defaultFilters);

  // // const { courses, coursesLoading } = useGetCourses();

  // const handleFilters = useCallback(
  //   (name: string, value: IUserTableFilterValue) => {
  //     table.onResetPage();
  //     setFilters((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   },
  //   [table]
  // );

  // const handleFilterStatus = useCallback(
  //   (event: React.SyntheticEvent, newValue: string) => {
  //     handleFilters('status', newValue);
  //   },
  //   [handleFilters]
  // );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Courses"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Courses' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.user.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New User
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {/* <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'active' && 'success') ||
                    (tab.value === 'pending' && 'warning') ||
                    (tab.value === 'banned' && 'error') ||
                    'default'
                  }
                >
                  {['active', 'pending', 'banned', 'rejected'].includes(tab.value)
                    ? tableData.filter((user) => user.status === tab.value).length
                    : tableData.length}
                </Label>
              }
            />
          ))}
        </Tabs>
      </Card> */}
    </Container>
  );
}
