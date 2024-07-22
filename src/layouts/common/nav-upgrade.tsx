import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function NavUpgrade() {
  // const { user } = useMockedUser();
  const { user } = useAuthContext();

  return (
    <Stack
      sx={{
        px: 2,
        py: 5,
        textAlign: 'center',
        position: 'absolute',
        left: '20px',
        bottom: '0',
      }}
    >
      <Stack alignItems="center">
        <Box sx={{ position: 'relative' }}>
          <Avatar src={user?.profileImage} alt={user?.name} sx={{ width: 48, height: 48 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>

          {/* <Label
            color="success"
            variant="filled"
            sx={{
              top: -6,
              px: 0.5,
              left: 40,
              height: 20,
              position: 'absolute',
              borderBottomLeftRadius: 2,
            }}
          >
            Free
          </Label> */}
        </Box>

        <Stack spacing={0.5} sx={{ mb: 2, mt: 1.5, width: 1 }}>
          <Typography variant="subtitle2" noWrap>
            {user?.name}
          </Typography>

          <Typography variant="body2" noWrap sx={{ color: 'text.disabled' }}>
            {user?.email}
          </Typography>
        </Stack>

        {/* <Button variant="contained" href={paths.minimalUI} target="_blank" rel="noopener">
          Upgrade to Pro
        </Button> */}
      </Stack>
    </Stack>
  );
}
