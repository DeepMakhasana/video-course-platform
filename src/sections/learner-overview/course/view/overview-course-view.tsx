import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import PurchaseCourseList from '../purchase-course-list';

export default function OverviewLearnerCourseView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <PurchaseCourseList />
    </Container>
  );
}
