import { Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';

import PurchaseList from '../purchase-list';

export default function OverviewPurchaseView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <PurchaseList />
    </Container>
  );
}
