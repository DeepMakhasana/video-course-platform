import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import Dashboard from '../dashboard';

export default function OverviewDashboardView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Dashboard />
    </Container>
  );
}
