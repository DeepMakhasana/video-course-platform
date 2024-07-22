import { useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import { useAuthContext } from 'src/auth/hooks';

import ScrollProgress from 'src/components/scroll-progress';

import HomeMinimal from '../home-minimal';

// ----------------------------------------------------------------------

// type StyledPolygonProps = {
//   anchor?: 'top' | 'bottom';
// };

// const StyledPolygon = styled('div')<StyledPolygonProps>(({ anchor = 'top', theme }) => ({
//   left: 0,
//   zIndex: 9,
//   height: 80,
//   width: '100%',
//   position: 'absolute',
//   clipPath: 'polygon(0% 0%, 100% 100%, 0% 100%)',
//   backgroundColor: theme.palette.background.default,
//   display: 'block',
//   lineHeight: 0,
//   ...(anchor === 'top' && {
//     top: -1,
//     transform: 'scale(-1, -1)',
//   }),
//   ...(anchor === 'bottom' && {
//     bottom: -1,
//     backgroundColor: theme.palette.grey[900],
//   }),
// }));

// ----------------------------------------------------------------------

export default function HomeView() {
  const { scrollYProgress } = useScroll();
  const { login } = useAuthContext();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('token') as string;
    console.log('useEffect - home view');
    if (accessToken) {
      login(accessToken);
    }
  }, [login, searchParams]);

  return (
    <>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      {/* <HomeHero /> */}

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <HomeMinimal />

        {/* <HomeHugePackElements />

        <Box sx={{ position: 'relative' }}>
          <StyledPolygon />
          <HomeForDesigner />
          <StyledPolygon anchor="bottom" />
        </Box>

        <HomeDarkMode />

        <HomeColorPresets />

        <HomeCleanInterfaces />

        <HomePricing />

        <HomeLookingFor />

        <HomeAdvertisement /> */}
      </Box>
    </>
  );
}
