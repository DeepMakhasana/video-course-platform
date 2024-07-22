import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';
import { Draggable, Droppable, DragDropContext } from '@hello-pangea/dnd';

import DragIndicatorRoundedIcon from '@mui/icons-material/DragIndicatorRounded';
import {
  Box,
  Grid,
  Card,
  Button,
  Select,
  Dialog,
  MenuItem,
  Container,
  TextField,
  Accordion,
  Typography,
  InputLabel,
  FormControl,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  useCreateTopicMiddle,
  useUpdateTopicPosition,
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
  // const [checkedItems, setCheckedItems] = useState<VideoAssignType[] | null>(null);

  const { playlist, playlistLoading } = useGetCoursesPlaylistVideos(course.playlist);
  const { modulesWithTopics, modulesWithTopicsMutate } = useGetCoursesModuleWithTopic(course.id);
  const { modules, modulesMutate } = useGetCoursesModules(course?.id);
  const { topicCreateMutate } = useCreateTopic();
  const { topicAddAtMiddle } = useCreateTopicMiddle();
  const { topicPositionUpdateMutate } = useUpdateTopicPosition();

  const { moduleCreateMutate } = useCreateModule();
  // const { topicCreateMutate, topicCreateLoading } = useCreateTopic();
  const { enqueueSnackbar } = useSnackbar();

  const [playlistVideos, setPlaylistVideos] = useState<any[]>(playlist);
  const [moduleVideos, setModuleVideos] = useState<any[]>(modulesWithTopics);

  // console.log('checkedItems', checkedItems);
  // console.log('playlist', playlist);
  // console.log('checkedItems', checkedItems);
  // console.log('modules', modulesWithTopics);

  // const handleCheckedItemsChange = (event: any) => {
  //   setCheckedItems((pre) => [...pre, event.target.name]);
  // };

  useEffect(() => {
    setPlaylistVideos(playlist);
  }, [playlist]);

  useEffect(() => {
    setModuleVideos(modulesWithTopics);
  }, [modulesWithTopics]);

  const handleOnDragEnd = (result: any) => {
    // console.log('dragEnd', result);
    if (!result.destination) return;

    const reorderedItems = Array.from(moduleVideos);
    const reorderedVideos = Array.from(playlistVideos);

    if (result.source.droppableId === 'playlistVideo') {
      // This case add the video in module
      // remove from source
      const [movedVideo] = reorderedVideos.splice(result.source.index, 1);

      reorderedItems[result.destination.droppableId - 1].topics.splice(
        result.destination.index,
        0,
        movedVideo
      );

      const assignedVideos = {
        videoId: movedVideo.snippet.resourceId.videoId,
        moduleId: reorderedItems[result.destination.droppableId - 1].id,
        preVideo:
          result.destination.index === 0
            ? null
            : reorderedItems[result.destination.droppableId - 1].topics[
                result.destination.index - 1
              ],
        nextVideo: !reorderedItems[result.destination.droppableId - 1].topics[
          result.destination.index + 1
        ]
          ? null
          : reorderedItems[result.destination.droppableId - 1].topics[result.destination.index + 1],
      };

      if (!assignedVideos.nextVideo) {
        const { length } = reorderedItems[result.destination.droppableId - 1].topics;
        console.log('length', length);

        console.log(assignedVideos.moduleId);

        const payload = {
          video: assignedVideos.videoId,
          index: length,
          lockedStatus: true,
          moduleId: Number(assignedVideos.moduleId),
        };

        (async () => {
          const res = await topicCreateMutate({
            topic: payload,
          });
          console.log(res);
          if (res) {
            console.log('created..');
            enqueueSnackbar('added.');
          }
        })();
      } else {
        const payload = {
          nextVideo: result.destination.index + 1,
          moduleId: Number(assignedVideos.moduleId),
          videoId: assignedVideos.videoId,
        };

        (async () => {
          const res = await topicAddAtMiddle(payload);
          console.log(res);
          if (res) {
            console.log('Updated..');
            enqueueSnackbar('Updated.');
          }
        })();
      }

      // setCheckedItems((pre: any) => {
      //   if (pre) {
      //     return [...pre, assignedVideos];
      //   }
      //   return [assignedVideos];
      // });

      setPlaylistVideos(reorderedVideos);
      setModuleVideos(reorderedItems);
    } else if (result.destination.droppableId === 'playlistVideo') {
      // This case delete the video from module
      // remove from source
      const [movedVideo] = reorderedItems[result.source.droppableId - 1].topics.splice(
        result.source.index,
        1
      );

      reorderedVideos.splice(result.destination.index, 0, movedVideo);

      setPlaylistVideos(reorderedVideos);
      setModuleVideos(reorderedItems);
    } else {
      const [movedItem] = reorderedItems[result.source.droppableId - 1].topics.splice(
        result.source.index,
        1
      );

      reorderedItems[result.destination.droppableId - 1].topics.splice(
        result.destination.index,
        0,
        movedItem
      );

      const payload = {
        nextVideo: result.destination.index + 1,
        moduleId: reorderedItems[result.destination.droppableId - 1].id,
        videoId: movedItem?.snippet?.resourceId?.videoId
          ? movedItem?.snippet?.resourceId?.videoId
          : movedItem.video,
        topicId:
          reorderedItems[result.destination.droppableId - 1].topics[result.destination.index].id,
      };

      // console.log(payload);
      (async () => {
        const res = await topicPositionUpdateMutate(payload);
        console.log(res);
        if (res) {
          console.log('Updated..');
          enqueueSnackbar('Updated.');
        }
      })();

      setModuleVideos(reorderedItems);
    }
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

  // const handelTopicCreate = async () => {
  //   if (selectedModule.length === 0 || checkedItems.length === 0) {
  //     enqueueSnackbar('Please Select video or module.', { variant: 'error' });
  //     return;
  //   }
  //   const topics = checkedItems.map((video, i) => ({
  //     video,
  //     index: i,
  //     lockedStatus: true,
  //     moduleId: selectedModule,
  //   }));

  //   const payload = {
  //     topics,
  //   };

  //   const data = await topicCreateMutate(payload);
  //   console.log('payload: ', data);

  //   if (!data) {
  //     enqueueSnackbar('Error while creating topic.', { variant: 'error' });
  //     return;
  //   }

  //   playlist.filter((video: any) => !checkedItems.includes(video.snippet.resourceId.videoId));
  //   setSelectedModule('');
  //   setCheckedItems([]);
  //   playlistMutate();
  //   modulesWithTopicsMutate();
  //   enqueueSnackbar('Topic created successfully!');
  // };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <DragDropContext onDragEnd={handleOnDragEnd}>
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
            <Scrollbar sx={{ height: '80vh' }}>
              <Box sx={{ p: '1rem' }}>
                {moduleVideos.map((moduleWithTopic: any, index: number) => (
                  <Accordion key={moduleWithTopic.index}>
                    <DropTarget droppableId={`${moduleWithTopic.index}`}>
                      <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
                        <Typography variant="subtitle1">{moduleWithTopic.title}</Typography>
                      </AccordionSummary>

                      <AccordionDetails sx={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                        {moduleWithTopic.topics.map((topic: any, i: number) => (
                          <DraggableModuleVideo topic={topic} index={i} key={topic.id} />
                        ))}
                      </AccordionDetails>
                    </DropTarget>
                  </Accordion>
                ))}
                {/* </ComponentBlock> */}
              </Box>
            </Scrollbar>
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
                    <DropTarget droppableId="playlistVideo">
                      <Scrollbar sx={{ height: '80vh', padding: '1rem 0.5rem' }}>
                        {/* <FormGroup sx={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
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
                    </FormGroup> */}
                        <Box sx={{ display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
                          {playlistVideos?.map((video: any, i: number) => (
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
                              <DraggablePlaylistVideo playlistVideo={video} index={i} />
                            </Box>
                          ))}
                        </Box>
                      </Scrollbar>
                    </DropTarget>
                    {/* <Box
                      sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: '1rem',
                      }}
                    >
                      <Button variant="contained">
                        Save
                      </Button>
                    </Box> */}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DragDropContext>
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
            backgroundColor: snapshot.isDraggingOver ? '#defade' : '#f0faf0',
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
            display: 'flex',
            gap: '0.8rem',
            alignItems: 'center',
          }}
        >
          <DragIndicatorRoundedIcon sx={{ color: '#454545' }} fontSize="large" />
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

function DraggableModuleVideo({ topic, index }: any) {
  return (
    <Draggable draggableId={topic?.id.toString()} index={index}>
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
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <DragIndicatorRoundedIcon sx={{ color: '#454545' }} fontSize="large" />
          <iframe
            width="280"
            height="140"
            key={topic.id ? topic.id : topic.snippet.resourceId.videoId}
            src={`https://www.youtube.com/embed/${
              topic.video ? topic.video : topic.snippet.resourceId.videoId
            }?si=x92tq7UY4kTGRB3w`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            style={{ border: 'none', borderRadius: '10px' }}
          />
        </Box>
      )}
    </Draggable>
  );
}
