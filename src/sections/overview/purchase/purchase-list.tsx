import { useState, useCallback } from 'react';

import { alpha, Stack } from '@mui/system';
import {
  Box,
  Tab,
  Card,
  Tabs,
  Table,
  Tooltip,
  TableRow,
  Container,
  TableBody,
  TableCell,
  IconButton,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetPurchasedCourseList } from 'src/api/purchase';

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
  TablePaginationCustom,
} from 'src/components/table';

type RowDataType = {
  id: number;
  name: string;
  email: string;
  title: string;
  status: string;
  createAt: string;
};

function createData(
  id: number,
  name: string,
  email: string,
  title: string,
  status: string,
  createAt: string
) {
  return { id, name, email, title, status, createAt };
}

const STATUS_OPTIONS = [
  { value: 'All', label: 'All' },
  { value: 'Completed', label: 'Completed' },
  { value: 'Pending', label: 'Pending' },
  { value: 'Fail', label: 'Fail' },
];

const TABLE_HEAD = [
  { id: 'id', label: 'Id' },
  { id: 'name', label: 'name', width: 180 },
  { id: 'email', label: 'email', width: 100 },
  { id: 'title', label: 'Course', width: 250 },
  { id: 'status', label: 'Status', width: 100 },
  { id: 'createdAt', label: 'Created at', width: 250 },
];

const defaultFilters = {
  status: 'All',
};

export default function PurchaseList() {
  const settings = useSettingsContext();

  const table = useTable({
    defaultOrderBy: 'title',
  });

  const [filters, setFilters] = useState(defaultFilters);

  const { purchasedCourses, purchasedCoursesLoading } = useGetPurchasedCourseList();

  console.log(purchasedCourses);

  const tableData = purchasedCourses
    ?.map((course: any) =>
      createData(
        course.learner.id,
        course.learner.name,
        course.learner.email,
        course.course.title,
        'Completed',
        course.createdAt
      )
    )
    .filter((course: any) => filters.status === course.status || filters.status === 'All');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

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

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Purchase courses"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'purchase' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {purchasedCoursesLoading ? (
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
                      (tab.value === 'Completed' && 'success') ||
                      (tab.value === 'Pending' && 'warning') ||
                      (tab.value === 'Fail' && 'error') ||
                      'default'
                    }
                  >
                    {['Completed', 'Pending', 'Fail'].includes(tab.value)
                      ? tableData?.filter((course: any) => course.status === tab.value).length
                      : tableData.length}
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
              {/* <TableSelectedAction
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
              /> */}

              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={dataFiltered.length}
                    onSort={table.onSort}
                  />

                  <TableBody>
                    {dataFiltered
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((row, i) => (
                        <TableRow
                          hover
                          key={i}
                          // onClick={() => table.onSelectRow(`${row.id}`)}
                          // selected={table.selected.includes(`${row.id}`)}
                        >
                          {/* <TableCell padding="checkbox">
                            <Checkbox checked={table.selected.includes(`${row.id}`)} />
                          </TableCell> */}
                          <TableCell> {row.id} </TableCell>
                          <TableCell align="left">{row.name}</TableCell>
                          <TableCell align="left">{row.email}</TableCell>
                          <TableCell align="left">{row.title}</TableCell>
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
