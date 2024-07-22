import Fab from '@mui/material/Fab';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';

import { ICourseListType } from 'src/types/course';

import { useCheckoutContext } from '../checkout/context';

// ----------------------------------------------------------------------

type Props = {
  course: ICourseListType;
};

export default function ProductItem({ course }: Props) {
  const { onAddToCart } = useCheckoutContext();

  const { id, title, price, timeDurationDay, description, coverImage } = course;

  const linkTo = paths.course.details(String(id));

  const handleAddCart = async () => {
    const newCourse = {
      id,
      title,
      price,
      coverImage,
      description,
      timeDurationDay,
      quantity: 1,
    };
    try {
      onAddToCart(newCourse);
    } catch (error) {
      console.error(error);
    }
  };

  // const renderLabels = (newLabel.enabled || saleLabel.enabled) && (
  //   <Stack
  //     direction="row"
  //     alignItems="center"
  //     spacing={1}
  //     sx={{ position: 'absolute', zIndex: 9, top: 16, right: 16 }}
  //   >
  //     {newLabel.enabled && (
  //       <Label variant="filled" color="info">
  //         {newLabel.content}
  //       </Label>
  //     )}
  //     {saleLabel.enabled && (
  //       <Label variant="filled" color="error">
  //         {saleLabel.content}
  //       </Label>
  //     )}
  //   </Stack>
  // );

  const renderImg = (
    <Box sx={{ position: 'relative', p: 1 }}>
      {/* {!!available && ( */}
      <Fab
        color="warning"
        size="medium"
        className="add-cart-btn"
        onClick={handleAddCart}
        sx={{
          right: 16,
          bottom: 16,
          zIndex: 9,
          opacity: 0,
          position: 'absolute',
          transition: (theme) =>
            theme.transitions.create('all', {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.shorter,
            }),
        }}
      >
        <Iconify icon="solar:cart-plus-bold" width={24} />
      </Fab>
      {/* )} */}

      {/* <Tooltip title={!available && 'Out of stock'} placement="bottom-end">
        <Image
          alt={name}
          src={coverUrl}
          ratio="1/1"
          sx={{
            borderRadius: 1.5,
            ...(!available && {
              opacity: 0.48,
              filter: 'grayscale(1)',
            }),
          }}
        />
      </Tooltip> */}
    </Box>
  );

  const renderContent = (
    <Stack spacing={2.5} sx={{ p: 3, pt: 2, height: '100%', justifyContent: 'space-evenly' }}>
      <Link
        component={RouterLink}
        href={linkTo}
        color="inherit"
        variant="subtitle2"
        noWrap
        sx={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}
      >
        <Box>
          <img src={`https://transfry.s3.ap-south-1.amazonaws.com/${coverImage}`} alt={title} />
        </Box>
        {title}
      </Link>

      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* <ColorPreview colors={colors} /> */}

        <Stack direction="row" spacing={0.5} sx={{ typography: 'subtitle1', width: '100%' }}>
          {price && (
            <Box component="span" sx={{ color: 'text.disabled', textDecoration: 'line-through' }}>
              {fCurrency(price)}
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box component="span">{fCurrency(price)}</Box>

            <Button onClick={handleAddCart} variant="outlined">
              Add to cart
            </Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );

  return (
    <Card
      sx={{
        '&:hover .add-cart-btn': {
          opacity: 1,
        },
      }}
    >
      {/* {renderLabels} */}

      {renderImg}

      {renderContent}
    </Card>
  );
}
