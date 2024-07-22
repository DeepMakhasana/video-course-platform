import { Helmet } from 'react-helmet-async';

import { OverviewAppView } from 'src/sections/overview/app/view';

// ----------------------------------------------------------------------

export default function OverviewAppPage() {
  // const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> Dashboard: App</title>
      </Helmet>

      {/* {user?.role === 'trainer' ? <OverviewAppView /> : <OverviewDashboardView />} */}
      <OverviewAppView />
    </>
  );
}
