import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';

import { ICheckoutItem } from 'src/types/checkout';

// ----------------------------------------------------------------------

type Props = {
  row: ICheckoutItem;
  onDelete: VoidFunction;
};

export default function CheckoutCartProduct({ row, onDelete }: Props) {
  const { title, coverImage, timeDurationDay, price } = row;

  return (
    <TableRow>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar
          variant="rounded"
          alt={title}
          src={coverImage}
          sx={{ width: 64, height: 64, mr: 2 }}
        />

        <Stack spacing={0.5}>
          <Typography noWrap variant="subtitle2" sx={{ maxWidth: 240 }}>
            {title}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'body2', color: 'text.secondary' }}
          >
            <Label sx={{ ml: 0.5 }}>Duration: {timeDurationDay} </Label>
          </Stack>
        </Stack>
      </TableCell>

      <TableCell>{fCurrency(price)}</TableCell>

      {/* <TableCell>
        <Box sx={{ width: 88, textAlign: 'right' }}>
          <IncrementerButton onDecrease={onDecrease} onIncrease={onIncrease} />

          <Typography variant="caption" component="div" sx={{ color: 'text.secondary', mt: 1 }}>
            available: {available}
          </Typography>
        </Box>
      </TableCell> */}

      {/* <TableCell align="right">{fCurrency(price)}</TableCell> */}

      <TableCell align="right" sx={{ px: 1 }}>
        <IconButton onClick={onDelete}>
          <Iconify icon="solar:trash-bin-trash-bold" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
