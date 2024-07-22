import Slider from 'react-slick';
import { m } from 'framer-motion';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useGetCourses } from 'src/api/course';

import { LoadingScreen } from 'src/components/loading-screen';
import { varFade, MotionViewport } from 'src/components/animate';

import CartIcon from '../product/common/cart-icon';
import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

// const CARDS = [
//   {
//     icon: ' /assets/icons/home/ic_make_brand.svg',
//     title: 'Branding',
//     description: 'Consistent design makes it easy to brand your own.',
//   },
//   {
//     icon: ' /assets/icons/home/ic_design.svg',
//     title: 'UI & UX Design',
//     description:
//       'The kit is built on the principles of the atomic design system. It helps you to create projects fastest and easily customized packages for your projects.',
//   },
//   {
//     icon: ' /assets/icons/home/ic_development.svg',
//     title: 'Development',
//     description: 'Easy to customize and extend, saving you time and money.',
//   },
// ];

// ----------------------------------------------------------------------

export default function HomeMinimal() {
  const { courses, coursesLoading, coursesEmpty } = useGetCourses();
  const checkout = useCheckoutContext();
  // console.log(courses);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1200, // large devices
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 960, // medium devices
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 600, // small devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480, // extra-small devices
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleAddCart = async (newCourse: any) => {
    const course = {
      id: newCourse.id,
      title: newCourse.title,
      price: newCourse.price,
      coverImage: newCourse.coverImage,
      description: newCourse.description,
      timeDurationDay: newCourse.timeDurationDay,
      quantity: 1,
    };
    try {
      checkout.onAddToCart(course);
    } catch (error) {
      console.error(error);
    }
  };

  if (coursesLoading || coursesEmpty) {
    return (
      <Container
        maxWidth="lg"
        sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
      >
        <LoadingScreen />
      </Container>
    );
  }

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 15 },
      }}
    >
      <CartIcon totalItems={checkout.items.length} />
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography component="div" variant="overline" sx={{ color: 'text.disabled' }}>
            COURSES
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">
            Quality courses <br /> for software sector
          </Typography>
        </m.div>
      </Stack>
      <Box sx={{ width: '100%', margin: '0 auto', padding: '20px' }}>
        <Slider {...settings}>
          {courses?.map((course: any, index: number) => (
            <m.div variants={varFade().inUp} key={course.id}>
              <Card
                sx={{
                  textAlign: 'left',
                  boxShadow: { md: 'none' },
                  bgcolor: 'background.default',
                  p: (theme) => theme.spacing(10, 5),
                  ...(index === 1 && {
                    boxShadow: (theme) => ({
                      md: `-40px 40px 80px ${
                        theme.palette.mode === 'light'
                          ? alpha(theme.palette.grey[500], 0.16)
                          : alpha(theme.palette.common.black, 0.4)
                      }`,
                    }),
                  }),
                }}
              >
                <Box
                  component="img"
                  src={`https://transfry.s3.ap-south-1.amazonaws.com/${course.coverImage}`}
                  alt={course.title}
                  sx={{ mx: 'auto', width: '100%', height: 200, objectFit: 'contain' }}
                />

                <Typography variant="h5" sx={{ mt: 8, mb: 2 }}>
                  {course.title}
                </Typography>

                <Typography
                  sx={{ color: 'text.secondary', mb: '0.5rem', fontWeight: '700' }}
                >{`₹${course.price}`}</Typography>

                <Typography sx={{ color: 'text.secondary' }}>
                  {`${course.description.substring(0, 70)}...`}
                </Typography>

                <Box sx={{ mt: '1rem', display: 'flex', gap: '1rem' }}>
                  <Button variant="outlined" component={RouterLink} href={`/course/${course.id}`}>
                    View more
                  </Button>
                  <Button variant="contained" onClick={() => handleAddCart(course)}>
                    Buy now
                  </Button>
                </Box>
              </Card>
            </m.div>
          ))}
        </Slider>
      </Box>
    </Container>
  );
}
