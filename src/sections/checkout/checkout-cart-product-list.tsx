import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';

import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom } from 'src/components/table';

import { ICheckoutItem } from 'src/types/checkout';

import CheckoutCartProduct from './checkout-cart-product';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'product', label: 'Product' },
  { id: 'price', label: 'Price' },
  // { id: 'quantity', label: 'Quantity' },
  // { id: 'totalAmount', label: 'Total Price', align: 'right' },
  { id: '' },
];

// ----------------------------------------------------------------------

type Props = {
  products: ICheckoutItem[];
  onDelete: (id: string) => void;
};

export default function CheckoutCartProductList({ products, onDelete }: Props) {
  return (
    <TableContainer sx={{ overflow: 'unset' }}>
      <Scrollbar>
        <Table sx={{ minWidth: 720 }}>
          <TableHeadCustom headLabel={TABLE_HEAD} />

          <TableBody>
            {products.map((row) => (
              <CheckoutCartProduct
                key={row.id}
                row={row}
                onDelete={() => onDelete(String(row.id))}
              />
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
}
