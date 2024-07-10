import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import CourseList from '../course-list';

// ----------------------------------------------------------------------

export default function OverviewCourseView() {
  // const { user } = useMockedUser();

  // const theme = useTheme();

  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CourseList />
    </Container>
  );
}
