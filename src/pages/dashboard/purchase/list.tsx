import { Helmet } from 'react-helmet-async';

import OverviewPurchaseView from 'src/sections/overview/purchase/view/overview-purchase-view';

// ----------------------------------------------------------------------

export default function PurchaseListPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Product List</title>
      </Helmet>

      <OverviewPurchaseView />
    </>
  );
}
