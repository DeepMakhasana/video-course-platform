import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

import {
  Box,
  Grid,
  Card,
  Button,
  Select,
  Dialog,
  MenuItem,
  Checkbox,
  Container,
  FormGroup,
  TextField,
  Accordion,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  AccordionSummary,
  AccordionDetails,
  SelectChangeEvent,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import {
  useCreateTopic,
  useCreateModule,
  useGetCoursesModules,
  useGetCoursesPlaylistVideos,
  useGetCoursesModuleWithTopic,
} from 'src/api/course';

// import { RouterLink } from 'src/routes/components';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function CourseCurriculumView({ course }: { course?: any }) {
  const settings = useSettingsContext();
  const dialog = useBoolean();
  const [inputModule, setInputModule] = useState('');
  const [selectedModule, setSelectedModule] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const { playlist, playlistLoading, playlistMutate } = useGetCoursesPlaylistVideos(
    course.playlist
  );
  const { modulesWithTopics, modulesWithTopicsMutate } = useGetCoursesModuleWithTopic(course.id);
  const { modules, modulesMutate } = useGetCoursesModules(course?.id);

  const { moduleCreateMutate } = useCreateModule();
  const { topicCreateMutate, topicCreateLoading } = useCreateTopic();
  const { enqueueSnackbar } = useSnackbar();

  console.log('playlist', playlist);
  console.log('checkedItems', checkedItems);
  console.log('modules', modulesWithTopics);

  const handleCheckedItemsChange = (event: any) => {
    setCheckedItems((pre) => [...pre, event.target.name]);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedModule(event.target.value as string);
  };

  const handleModuleCreate = useCallback(async () => {
    if (inputModule) {
      const payload = {
        title: inputModule,
        index: modules.length === 0 ? 1 : modules.length + 1,
        courseId: course.id,
      };

      const data = await moduleCreateMutate(payload);

      if (data) {
        enqueueSnackbar('Module created successfully!');
        setInputModule('');
        modulesWithTopicsMutate();
        modulesMutate();
        dialog.onFalse();
      } else {
        enqueueSnackbar('Error while creating module.', { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Please enter module name.', { variant: 'error' });
    }
  }, [
    course.id,
    enqueueSnackbar,
    inputModule,
    moduleCreateMutate,
    modules.length,
    dialog,
    modulesMutate,
    modulesWithTopicsMutate,
  ]);

  const moduleCreateForm = (
    <Dialog open={dialog.value} onClose={dialog.onFalse}>
      <DialogTitle>Create module</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 3 }}>
          Create new module for course. Using module we can destructure the course and create best
          course.
        </Typography>

        <TextField
          autoFocus
          fullWidth
          type="module"
          margin="dense"
          variant="outlined"
          label="Module"
          value={inputModule}
          onChange={(e) => setInputModule(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleModuleCreate} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handelTopicCreate = async () => {
    if (selectedModule.length === 0 || checkedItems.length === 0) {
      enqueueSnackbar('Please Select video or module.', { variant: 'error' });
      return;
    }
    const topics = checkedItems.map((video, i) => ({
      video,
      index: i,
      lockedStatus: true,
      moduleId: selectedModule,
    }));

    const payload = {
      topics,
    };

    const data = await topicCreateMutate(payload);
    console.log('payload: ', data);

    if (!data) {
      enqueueSnackbar('Error while creating topic.', { variant: 'error' });
      return;
    }

    playlist.filter((video: any) => !checkedItems.includes(video.snippet.resourceId.videoId));
    setSelectedModule('');
    setCheckedItems([]);
    playlistMutate();
    modulesWithTopicsMutate();
    enqueueSnackbar('Topic created successfully!');
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Grid container>
        <Grid item xs={12} lg={6}>
          {/* curriculum heading */}
          <Box sx={{ padding: '0 1.2rem' }}>
            {dialog.value && moduleCreateForm}
            <CustomBreadcrumbs
              heading="Courses module"
              links={[
                { name: 'Dashboard', href: paths.dashboard.root },
                { name: 'Courses', href: paths.dashboard.courses.root },
                { name: 'Curriculum' },
              ]}
              action={
                <Button
                  onClick={dialog.onTrue}
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                >
                  New Module
                </Button>
              }
              sx={{
                mb: { xs: 3, md: 5 },
              }}
            />
          </Box>
          {/* curriculum section */}
          <Box sx={{ p: '1rem' }}>
            {modulesWithTopics.map((moduleWithTopic: any, index: number) => (
              <Accordion key={moduleWithTopic.id}>
                <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                  <Typography variant="subtitle1">{moduleWithTopic.title}</Typography>
                </AccordionSummary>

                <AccordionDetails sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {moduleWithTopic.topics.map((topic: any) => (
                    <iframe
                      // width="560"
                      // height="315"
                      key={topic.id}
                      src={`https://www.youtube.com/embed/${topic.video}?si=x92tq7UY4kTGRB3w`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      style={{ border: 'none', borderRadius: '10px' }}
                    />
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
            {/* </ComponentBlock> */}
          </Box>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ padding: '0 1rem' }}>
            <CardContent sx={{ padding: '0.5rem 0.2rem' }}>
              {/* playlist video heading */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <Typography component="h2" variant="subtitle1">
                  Playlist videos
                </Typography>
                <FormControl sx={{ width: '150px' }}>
                  <InputLabel id="demo-simple-select-label">Module</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedModule}
                    label="Module"
                    onChange={handleChange}
                  >
                    {modules.map((module: any) => (
                      <MenuItem key={module.id} value={module.id}>
                        {module.title}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* playlist videos section */}
              {playlistLoading ? (
                <Typography>Loading...</Typography>
              ) : (
                <Box sx={{ mt: '1rem' }}>
                  <Scrollbar sx={{ height: '60vh', padding: '1rem 0.5rem' }}>
                    <FormGroup sx={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                      {playlist?.map((video: any) => (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '1rem',
                            p: '0 1rem',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                          key={video.id}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                value={checkedItems.includes(video?.snippet?.resourceId?.videoId)}
                                name={video.snippet.resourceId.videoId}
                                onChange={handleCheckedItemsChange}
                              />
                            }
                            label={video.snippet.title}
                            key={video.snippet.resourceId.videoId}
                          />
                          <img
                            src={video.snippet.thumbnails.standard.url}
                            alt="topic"
                            height="100px"
                            style={{ objectFit: 'cover' }}
                          />
                        </Box>
                      ))}
                    </FormGroup>
                  </Scrollbar>
                  <Box
                    sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end', mt: '1rem' }}
                  >
                    <Button variant="contained" onClick={handelTopicCreate}>
                      {topicCreateLoading ? 'Creating..' : 'Create'}
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

function DropTarget({ droppableId, children }: any) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            padding: 4,
            margin: 1,
            backgroundColor: snapshot.isDraggingOver ? 'primary.main' : 'primary.light',
            minHeight: 100,
          }}
        >
          {children}
          {provided.placeholder}
        </Box>
      )}
    </Droppable>
  );
}

function DraggablePlaylistVideo({ playlistVideo, index }: any) {
  return (
    <Draggable draggableId={playlistVideo.snippet.resourceId.videoId.toString()} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            padding: 2,
            margin: 1,
            backgroundColor: snapshot.isDragging ? 'grey.400' : 'grey.200',
            cursor: 'move',
          }}
        >
          <img
            src={playlistVideo.snippet.thumbnails.standard.url}
            alt="topic"
            height="100px"
            style={{ objectFit: 'cover' }}
          />
          <Typography>{playlistVideo.snippet.title}</Typography>
        </Box>
      )}
    </Draggable>
  );
}

function DraggableModuleVideo({ item, index }: any) {
  return (
    <Draggable draggableId={item?.id.toString()} index={index}>
      {(provided, snapshot) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            padding: 2,
            margin: 1,
            backgroundColor: snapshot.isDragging ? 'grey.400' : 'grey.200',
            cursor: 'move',
          }}
        >
          {item?.text}
        </Box>
      )}
    </Draggable>
  );
}
