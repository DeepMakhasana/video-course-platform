import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useCallback } from 'react';

import EditRoundedIcon from '@mui/icons-material/EditRounded';
import {
  Box,
  Card,
  Stack,
  Table,
  Button,
  Dialog,
  Tooltip,
  Checkbox,
  TableRow,
  Container,
  TableBody,
  TableCell,
  IconButton,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  useGetInstructor,
  useEditInstructor,
  useCreateInstructor,
  useDeleteInstructor,
} from 'src/api/instructor';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { RHFTextField } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider from 'src/components/hook-form/form-provider';
import {
  useTable,
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

type RowDataType = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export type InstructorType = {
  id: number;
  name: string;
  email: string;
  role: string;
  description: string;
};

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'email', label: 'Email' },
  { id: 'role', label: 'Role' },
];

export default function InstructorList() {
  const settings = useSettingsContext();
  const [editInstructor, setEditInstructor] = useState<InstructorType | null>(null);
  const dialog = useBoolean();
  const deleteConfirmDialog = useBoolean();
  const [deleteId, setDeleteId] = useState(0);

  const { enqueueSnackbar } = useSnackbar();

  const { instructors, instructorsMutate } = useGetInstructor();
  const { instructorCreateMutate } = useCreateInstructor();
  const { instructorEditMutate } = useEditInstructor();
  const { instructorDeleteMutate } = useDeleteInstructor();

  const table = useTable({
    defaultOrderBy: 'name',
  });

  const tableData = instructors.map((instructor) => ({
    id: instructor.id,
    name: instructor.name,
    email: instructor.email,
    role: instructor.role,
  }));

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
  });

  const denseHeight = table.dense ? 34 : 34 + 20;

  // form handler
  const defaultValues = useMemo(
    () => ({
      name: (editInstructor?.name as string) || '',
      email: (editInstructor?.email as string) || '',
      role: (editInstructor?.role as string) || '',
      description: (editInstructor?.description as string) || '',
    }),
    [editInstructor]
  );

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email().required('Email is required'),
    role: Yup.string().required('Role is required'),
    description: Yup.string().required('Description is required'),
  });

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  // handler functions
  const handleEditDialog = (id: number) => {
    dialog.onTrue();
    const [editInstructorData] = instructors.filter((instructor) => instructor.id === id);
    setEditInstructor(editInstructorData);
    setValue('name', editInstructorData.name);
    setValue('email', editInstructorData.email);
    setValue('role', editInstructorData.role);
    setValue('description', editInstructorData.description);
  };

  const onSubmit = handleSubmit(async (data) => {
    let response;
    if (editInstructor) {
      response = await instructorEditMutate(editInstructor.id, data);
    } else {
      response = await instructorCreateMutate(data);
    }

    if (response) {
      table.selected.pop();
      enqueueSnackbar(`Instructor ${editInstructor ? 'edited' : 'created'}  successfully.`);
      instructorsMutate();
      setEditInstructor(null);
      reset();
      dialog.onFalse();
    } else {
      enqueueSnackbar(`Error while ${editInstructor ? 'editing' : 'creating'}  instructor.`, {
        variant: 'error',
      });
    }
  });

  const handelDelete = useCallback(
    async (id: number) => {
      const data = await instructorDeleteMutate(id);

      if (data) {
        instructorsMutate();
        table.selected.pop();
        enqueueSnackbar('delete success!');
      }
    },
    [enqueueSnackbar, instructorDeleteMutate, instructorsMutate, table]
  );

  // conformation of deleting
  const deleteConfirm = (
    <Dialog open={deleteConfirmDialog.value} onClose={deleteConfirmDialog.onFalse}>
      <DialogTitle>Delete Instructor Confirmation</DialogTitle>

      <DialogContent sx={{ color: 'text.secondary' }}>
        Are you sure you want to delete this Instructor? This action cannot be undone, and all
        associated data will be permanently removed.
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={deleteConfirmDialog.onFalse}>
          No
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            deleteConfirmDialog.onFalse();
            handelDelete(deleteId as number);
          }}
          autoFocus
        >
          Yes sure
        </Button>
      </DialogActions>
    </Dialog>
  );

  const createInstructorForm = (
    <Dialog open={dialog.value} onClose={dialog.onFalse}>
      <DialogTitle>Create Instructor</DialogTitle>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent>
          <Typography sx={{ mb: 3 }}>
            Create new Instructor. Using Instructor we can create and manage the courses.
          </Typography>
          <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
            <RHFTextField name="name" label="Instructor name" />
            <RHFTextField name="email" label="Email" />
            <RHFTextField name="role" label="Role" />
            <RHFTextField name="description" multiline rows={4} label="Description" />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              dialog.onFalse();
              reset();
              setEditInstructor(null);
            }}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isSubmitting
              ? `${editInstructor ? 'editing...' : 'creating...'}`
              : `${editInstructor ? 'Edit' : 'Create'}`}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Instructor"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Instructor' }]}
        action={
          <Button
            onClick={dialog.onTrue}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Instructor
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      {createInstructorForm}
      {deleteConfirm}

      {/* course list table */}
      <Card>
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
                    <Tooltip title="Edit" placement="top">
                      <IconButton
                        color="primary"
                        onClick={() => handleEditDialog(Number(table.selected[0]))}
                      >
                        <EditRoundedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}

                  <Tooltip title="Delete" placement="top">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        console.log(table.selected[0]);
                        deleteConfirmDialog.onTrue();
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
                        <TableCell> {row.name} </TableCell>
                        <TableCell align="left">{row.email}</TableCell>
                        <TableCell align="left">{row.role}</TableCell>
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
    </Container>
  );
}

// -------------------------------------------------------------------------

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
