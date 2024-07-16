import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import InstructorList from '../instructor-list';

export default function OverviewInstructorView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <InstructorList />
    </Container>
  );
}
