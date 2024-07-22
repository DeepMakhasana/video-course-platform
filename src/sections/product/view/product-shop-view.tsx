import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useGetCourses } from 'src/api/course';

import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import ProductList from '../product-list';
import CartIcon from '../common/cart-icon';
import { useCheckoutContext } from '../../checkout/context';

// ----------------------------------------------------------------------

// const defaultFilters: IProductFilters = {
//   gender: [],
//   colors: [],
//   rating: '',
//   category: 'all',
//   priceRange: [0, 200],
// };

// ----------------------------------------------------------------------

export default function ProductShopView() {
  const settings = useSettingsContext();

  const checkout = useCheckoutContext();

  // const openFilters = useBoolean();

  // const [sortBy, setSortBy] = useState('featured');

  // const [searchQuery, setSearchQuery] = useState('');

  // const debouncedQuery = useDebounce(searchQuery);

  // const [filters, setFilters] = useState(defaultFilters);

  // const { products, productsLoading, productsEmpty } = useGetProducts();
  const { courses, coursesLoading, coursesEmpty } = useGetCourses();

  // const { searchResults, searchLoading } = useSearchProducts(debouncedQuery);

  // const handleFilters = useCallback((name: string, value: IProductFilterValue) => {
  //   setFilters((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // }, []);

  // const handleResetFilters = useCallback(() => {
  //   setFilters(defaultFilters);
  // }, []);

  // const dataFiltered = applyFilter({
  //   inputData: courses,
  //   filters,
  //   sortBy,
  // });

  // const canReset = !isEqual(defaultFilters, filters);

  // const notFound = !dataFiltered.length && canReset;

  // const handleSortBy = useCallback((newValue: string) => {
  //   setSortBy(newValue);
  // }, []);

  // const handleSearch = useCallback((inputValue: string) => {
  //   setSearchQuery(inputValue);
  // }, []);

  // const renderFilters = (
  //   <Stack
  //     spacing={3}
  //     justifyContent="space-between"
  //     alignItems={{ xs: 'flex-end', sm: 'center' }}
  //     direction={{ xs: 'column', sm: 'row' }}
  //   >
  //     <ProductSearch
  //       query={debouncedQuery}
  //       results={searchResults}
  //       onSearch={handleSearch}
  //       loading={searchLoading}
  //       hrefItem={(id: string) => paths.product.details(id)}
  //     />

  //     <Stack direction="row" spacing={1} flexShrink={0}>
  //       <ProductFilters
  //         open={openFilters.value}
  //         onOpen={openFilters.onTrue}
  //         onClose={openFilters.onFalse}
  //         //
  //         filters={filters}
  //         onFilters={handleFilters}
  //         //
  //         canReset={canReset}
  //         onResetFilters={handleResetFilters}
  //         //
  //         colorOptions={PRODUCT_COLOR_OPTIONS}
  //         ratingOptions={PRODUCT_RATING_OPTIONS}
  //         genderOptions={PRODUCT_GENDER_OPTIONS}
  //         categoryOptions={['all', ...PRODUCT_CATEGORY_OPTIONS]}
  //       />

  //       <ProductSort sort={sortBy} onSort={handleSortBy} sortOptions={PRODUCT_SORT_OPTIONS} />
  //     </Stack>
  //   </Stack>
  // );

  // const renderResults = (
  //   <ProductFiltersResult
  //     filters={filters}
  //     onFilters={handleFilters}
  //     //
  //     canReset={canReset}
  //     onResetFilters={handleResetFilters}
  //     //
  //     results={dataFiltered.length}
  //   />
  // );

  const renderNotFound = <EmptyContent filled title="No Data" sx={{ py: 10 }} />;

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        mb: 15,
      }}
    >
      <CartIcon totalItems={checkout.items.length} />

      <Typography
        variant="h4"
        sx={{
          my: { xs: 3, md: 5 },
        }}
      >
        Courses
      </Typography>

      {/* <Stack
        spacing={2.5}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {renderFilters}

        {canReset && renderResults}
      </Stack> */}

      {coursesEmpty && renderNotFound}

      <ProductList courses={courses} loading={coursesLoading} />
    </Container>
  );
}

// ----------------------------------------------------------------------

// function applyFilter({
//   inputData,
//   filters,
//   sortBy,
// }: {
//   inputData: IProductItem[];
//   filters: IProductFilters;
//   sortBy: string;
// }) {
//   const { gender, category, colors, priceRange, rating } = filters;

//   const min = priceRange[0];

//   const max = priceRange[1];

//   // SORT BY
//   if (sortBy === 'featured') {
//     inputData = orderBy(inputData, ['totalSold'], ['desc']);
//   }

//   if (sortBy === 'newest') {
//     inputData = orderBy(inputData, ['createdAt'], ['desc']);
//   }

//   if (sortBy === 'priceDesc') {
//     inputData = orderBy(inputData, ['price'], ['desc']);
//   }

//   if (sortBy === 'priceAsc') {
//     inputData = orderBy(inputData, ['price'], ['asc']);
//   }

//   // FILTERS
//   if (gender.length) {
//     inputData = inputData.filter((product) => gender.includes(product.gender));
//   }

//   if (category !== 'all') {
//     inputData = inputData.filter((product) => product.category === category);
//   }

//   if (colors.length) {
//     inputData = inputData.filter((product) =>
//       product.colors.some((color) => colors.includes(color))
//     );
//   }

//   if (min !== 0 || max !== 200) {
//     inputData = inputData.filter((product) => product.price >= min && product.price <= max);
//   }

//   if (rating) {
//     inputData = inputData.filter((product) => {
//       const convertRating = (value: string) => {
//         if (value === 'up4Star') return 4;
//         if (value === 'up3Star') return 3;
//         if (value === 'up2Star') return 2;
//         return 1;
//       };
//       return product.totalRatings > convertRating(rating);
//     });
//   }

//   return inputData;
// }
