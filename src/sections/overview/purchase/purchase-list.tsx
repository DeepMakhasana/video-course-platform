import { useState } from 'react';
import { Draggable, Droppable, DragDropContext } from '@hello-pangea/dnd';

import { Box, Button, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function PurchaseList() {
  const settings = useSettingsContext();
  const [items, setItems] = useState([
    {
      section: 1,
      items: [
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
        { id: 4, text: 'Item 4' },
      ],
    },
    {
      section: 2,
      items: [
        { id: 11, text: 'Item 11' },
        { id: 22, text: 'Item 22' },
        { id: 33, text: 'Item 33' },
        { id: 44, text: 'Item 44' },
      ],
    },
  ]);

  const [videos, setVideos] = useState([
    { id: 5, text: 'Video 1' },
    { id: 6, text: 'Video 2' },
    { id: 7, text: 'Video 3' },
    { id: 8, text: 'Video 4' },
  ]);

  const handleOnDragEnd = (result: any) => {
    console.log('dragEnd', result);
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const reorderedVideos = Array.from(videos);

    if (result.source.droppableId === 'video') {
      const [movedVideo] = reorderedVideos.splice(result.source.index, 1);

      reorderedItems[result.destination.droppableId - 1].items.splice(
        result.destination.index,
        0,
        movedVideo
      );

      setVideos(reorderedVideos);
      setItems(reorderedItems);
    } else {
      const [movedItem] = reorderedItems[result.source.droppableId - 1].items.splice(
        result.source.index,
        1
      );
      reorderedItems[result.destination.droppableId - 1].items.splice(
        result.destination.index,
        0,
        movedItem
      );

      setItems(reorderedItems);
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Courses"
        links={[{ name: 'Dashboard', href: paths.dashboard.root }, { name: 'Courses' }]}
        action={
          <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
            New task
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Typography variant="h4" gutterBottom>
          Drag and Drop Example
        </Typography>

        <Box sx={{ display: 'flex', gap: '2rem' }}>
          <Box>
            {/* modules */}
            {items.map((section) => (
              <DropTarget droppableId={`${section.section}`} key={`${section.section}`}>
                {section.items.map((item: any, index: number) => (
                  <DraggableItem key={item.id} item={item} index={index} />
                ))}
              </DropTarget>
            ))}
          </Box>

          {/* videos */}
          <DropTarget droppableId="video">
            {videos.map((item: any, index: number) => (
              <DraggableItem key={item.id} item={item} index={index} />
            ))}
          </DropTarget>
        </Box>
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

function DraggableItem({ item, index }: any) {
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
