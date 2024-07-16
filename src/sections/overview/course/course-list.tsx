// import { useState, useCallback } from 'react';

import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import {
  Tab,
  Box,
  Card,
  Tabs,
  alpha,
  Stack,
  Table,
  Button,
  Dialog,
  Tooltip,
  TableRow,
  Checkbox,
  Container,
  TableBody,
  TableCell,
  Typography,
  IconButton,
  DialogTitle,
  DialogActions,
  DialogContent,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetCourses, useDeleteCourse } from 'src/api/course';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import { ICourseTableFilters } from 'src/types/course';

type RowDataType = {
  id: number;
  title: string;
  instructor: string;
  price: number;
  status: string;
  createAt: string;
};

function createData(
  id: number,
  title: string,
  instructor: string,
  price: number,
  status: string,
  createAt: string
) {
  return { id, title, instructor, price, status, createAt };
}

const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Live', label: 'Live' },
  { value: 'Processing', label: 'Processing' },
];

const TABLE_HEAD = [
  { id: 'title', label: 'Title' },
  { id: 'instructor', label: 'Instructor', width: 180 },
  { id: 'price', label: 'Price', width: 100 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'createdAt', label: 'Created at', width: 250 },
];

const defaultFilters: ICourseTableFilters = {
  title: '',
  //   role: [],
  instructor: '',
  status: 'All',
};

export default function CourseList() {
  const settings = useSettingsContext();
  const router = useRouter();
  const { courseDeleteMutate } = useDeleteCourse();
  const { enqueueSnackbar } = useSnackbar();
  const dialog = useBoolean();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const table = useTable({
    defaultOrderBy: 'title',
  });

  const [filters, setFilters] = useState(defaultFilters);

  const { courses, coursesLoading, coursesMutate } = useGetCourses();

  const tableData = courses
    ?.map((course) =>
      createData(
        course.id,
        course.title,
        course.instructor.name,
        course.price,
        course.status,
        course.createdAt
      )
    )
    .filter((course) => filters.status === course.status || filters.status === 'All');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  console.log(dataFiltered);

  const denseHeight = table.dense ? 34 : 34 + 20;

  const handleFilters = useCallback(
    (name: string, value: any) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleFilterStatus = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleEdit = useCallback(
    (id: number) => {
      router.push(`${paths.dashboard.courses.edit}/${id}`);
    },
    [router]
  );

  const handleEditCurriculum = useCallback(
    (id: number) => {
      router.push(`${paths.dashboard.courses.curriculum}/${id}`);
    },
    [router]
  );

  const handelDelete = useCallback(
    async (id: number) => {
      const data = await courseDeleteMutate(id);

      if (data) {
        coursesMutate();
        table.selected.pop();
        enqueueSnackbar('delete success!');
      }
    },
    [courseDeleteMutate, enqueueSnackbar, coursesMutate, table]
  );

  const deleteConfirm = (
    <Dialog open={dialog.value} onClose={dialog.onFalse}>
      <DialogTitle>Delete Course Confirmation</DialogTitle>

      <DialogContent sx={{ color: 'text.secondary' }}>
        Are you sure you want to delete this course? This action cannot be undone, and all
        associated data will be permanently removed.
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={dialog.onFalse}>
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            dialog.onFalse();
            handelDelete(deleteId as number);
          }}
          autoFocus
        >
          Yes sure
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Courses"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Courses' }]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.courses.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Course
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {dialog.value && deleteConfirm}

      {coursesLoading ? (
        <Typography>Course Loading...</Typography>
      ) : (
        <Card>
          <Tabs
            value={filters.status}
            onChange={handleFilterStatus}
            sx={{
              px: 2.5,
              boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
            }}
          >
            {STATUS_OPTIONS.map((tab) => (
              <Tab
                key={tab.value}
                iconPosition="end"
                value={tab.value}
                label={tab.label}
                defaultValue="All"
                icon={
                  <Label
                    variant={
                      ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                    }
                    color={
                      (tab.value === 'Live' && 'success') ||
                      (tab.value === 'Processing' && 'warning') ||
                      'default'
                    }
                  >
                    {['Live', 'Processing'].includes(tab.value)
                      ? courses.filter((course) => course.status === tab.value).length
                      : courses.length}
                  </Label>
                }
              />
            ))}
          </Tabs>

          {/* course list table */}
          <Box>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 3 }}>
              <Typography variant="h6">Courses list</Typography>

              <Tooltip title="Filter list">
                <IconButton>
                  <Iconify icon="ic:round-filter-list" />
                </IconButton>
              </Tooltip>
            </Stack>

            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={dataFiltered.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((row) => `${row.id}`)
                  )
                }
                action={
                  <Box>
                    {table.selected.length === 1 && (
                      <>
                        <Tooltip title="Edit" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => handleEdit(Number(table.selected[0]))}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Curriculum" placement="top">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditCurriculum(Number(table.selected[0]))}
                          >
                            <EditNoteRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}

                    <Tooltip title="Delete" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          dialog.onTrue();
                          setDeleteId(Number(table.selected[0]));
                        }}
                      >
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              />

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        dataFiltered.map((row) => `${row.id}`)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row) => (
                        <TableRow
                          hover
                          key={row.id}
                          onClick={() => table.onSelectRow(`${row.id}`)}
                          selected={table.selected.includes(`${row.id}`)}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox checked={table.selected.includes(`${row.id}`)} />
                          </TableCell>
                          <TableCell> {row.title} </TableCell>
                          <TableCell align="left">{row.instructor}</TableCell>
                          <TableCell align="left">{row.price}</TableCell>
                          <TableCell align="left">{row.status}</TableCell>
                          <TableCell align="left">{row.createAt}</TableCell>
                        </TableRow>
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(table.page, table.rowsPerPage, dataFiltered.length)}
                    />
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>

            <TablePaginationCustom
              count={dataFiltered.length}
              page={table.page}
              rowsPerPage={table.rowsPerPage}
              onPageChange={table.onChangePage}
              onRowsPerPageChange={table.onChangeRowsPerPage}
              //
              dense={table.dense}
              onChangeDense={table.onChangeDense}
            />
          </Box>
        </Card>
      )}
    </Container>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  comparator,
}: {
  inputData: RowDataType[];
  comparator: (a: any, b: any) => number;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);

    if (order !== 0) return order;

    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  return inputData;
}
