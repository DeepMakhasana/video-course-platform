import { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import {
  Box,
  Dialog,
  AppBar,
  Button,
  Toolbar,
  Accordion,
  Container,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetCoursesById, useGetVideoCourseById } from 'src/api/course';

import { LoadingScreen } from 'src/components/loading-screen';

type SelectedVideoType = {
  title: string;
  videoId: string;
};

export default function CourseDetailView({ id }: { id: number }) {
  const { course } = useGetCoursesById(id);
  const { videoCourse, videoCourseLoading } = useGetVideoCourseById(id);
  const { value, onFalse, onTrue } = useBoolean();
  const [selectVideo, setSelectedVideo] = useState<SelectedVideoType | null>(null);

  const videoOpen = (
    <Dialog fullScreen open={value} onClose={onFalse}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          {/* <IconButton edge="start" color="inherit" onClick={onFalse} aria-label="close">
            close
          </IconButton> */}
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {selectVideo?.title}
          </Typography>
          <Button color="inherit" variant="outlined" onClick={onFalse} aria-label="close">
            close
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          // margin: '0 auto',
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${selectVideo?.videoId}?si=x92tq7UY4kTGRB3w`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{ border: 'none', borderRadius: '10px', width: '90%', height: '90%' }}
        />
      </Box>
    </Dialog>
  );

  if (videoCourseLoading) {
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
    <Container maxWidth="lg">
      {videoOpen}
      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center', width: '100%', my: '2rem' }}>
        <Box sx={{ width: '50%', display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <Typography variant="h3" component="h1">
            {course?.title}
          </Typography>
          <Typography variant="h5" component="span">
            ₹ {course?.price}
          </Typography>
          <Typography variant="body1" component="p">
            {course?.description}
          </Typography>
        </Box>
        <Box sx={{ width: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img
            src={`https://transfry.s3.ap-south-1.amazonaws.com/${course.coverImage}`}
            alt={course.title}
            style={{ objectFit: 'contain', width: '70%', borderRadius: '10px' }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: '2rem', my: '4rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <Typography variant="h4" component="h1" sx={{ textAlign: 'justify' }}>
            Benefits
          </Typography>
          <Typography variant="body1" component="p" sx={{ textAlign: 'justify' }}>
            {course?.benefits}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
          <Typography variant="h4" component="h1" sx={{ textAlign: 'justify' }}>
            Materials
          </Typography>
          <Typography variant="body1" component="p" sx={{ textAlign: 'justify' }}>
            {course?.materials}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'justify' }}>
          Curriculum
        </Typography>
        <Box sx={{ my: '2rem' }}>
          {videoCourse.map((module: any, i: number) => {
            if (i === 0) {
              return (
                <Accordion defaultExpanded key={module.id}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    sx={{ py: '0.5rem' }}
                  >
                    <Typography>{module.title}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    {module.topics.map((topic: any) => (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          my: '2rem',
                          borderBottom: '0.5px solid #454545',
                          pb: '1rem',
                        }}
                        key={topic.id}
                      >
                        <Typography>{topic.title}</Typography>
                        <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <Typography>{topic.duration}</Typography>
                          {topic.lockedStatus ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
                          <Box
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                              onTrue();
                              setSelectedVideo({
                                title: topic.title,
                                videoId: topic.video,
                              });
                            }}
                          >
                            {!topic.lockedStatus && <PlayCircleIcon />}
                          </Box>
                        </Box>
                      </Box>
                    ))}
                  </AccordionDetails>
                </Accordion>
              );
            }
            return (
              <Accordion key={module.id}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                  sx={{ py: '0.5rem' }}
                >
                  <Typography>{module.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {module.topics.map((topic: any) => (
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        my: '2rem',
                        borderBottom: '0.5px solid #454545',
                        pb: '1rem',
                      }}
                      key={topic.id}
                    >
                      <Typography>{topic.title}</Typography>
                      <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Typography>{topic.duration}</Typography>
                        {topic.lockedStatus ? <LockOutlinedIcon /> : <LockOpenOutlinedIcon />}
                      </Box>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      </Box>
    </Container>
  );
}
