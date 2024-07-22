import { useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import {
  Box,
  AppBar,
  Button,
  Dialog,
  Toolbar,
  Accordion,
  Container,
  Typography,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useGetVideoCourseById } from 'src/api/course';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

type SelectedVideoType = {
  title: string;
  videoId: string;
};

export default function PurchaseCourseDetailView({ course }: { course: any }) {
  const settings = useSettingsContext();
  const { value, onFalse, onTrue } = useBoolean();
  const { videoCourse, videoCourseLoading } = useGetVideoCourseById(course.id);
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
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <CustomBreadcrumbs
        heading={course.title}
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Courses', href: paths.dashboard.root },
          { name: 'Learning' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {videoOpen}
      <Box>
        <Typography variant="h4" component="h1" sx={{ textAlign: 'justify' }}>
          Curriculum
        </Typography>
        <Box sx={{ my: '2rem' }}>
          {videoCourse.map((module: any, i: number) => (
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
                      cursor: 'pointer',
                    }}
                    key={topic.id}
                    onClick={() => {
                      onTrue();
                      setSelectedVideo({
                        title: topic.title,
                        videoId: topic.video,
                      });
                    }}
                  >
                    <Typography>{topic.title}</Typography>
                    <Box sx={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <Typography>{topic.duration}</Typography>
                      <Box>
                        <PlayCircleIcon />
                      </Box>
                    </Box>
                  </Box>
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Box>
    </Container>
  );
}
