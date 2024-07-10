import { useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';

// import { useSearchParams } from 'src/routes/hooks';

// import { useAuthContext } from 'src/auth/hooks';
// import { PATH_AFTER_LOGIN } from 'src/config-global';

// ----------------------------------------------------------------------

export default function Auth0LoginView() {
  const { register } = useAuthContext();

  // const searchParams = useSearchParams();

  // const returnTo = searchParams.get('returnTo');

  const handleSignUp = useCallback(
    async (userType: string) => {
      try {
        register(userType);
      } catch (error) {
        console.error(error);
      }
    },
    [register]
  );

  return (
    <>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Sign in to Minimal
      </Typography>

      <Stack spacing={2}>
        <Button
          fullWidth
          color="primary"
          size="large"
          variant="contained"
          onClick={() => handleSignUp('learner')}
        >
          SignUp with Google as Learner
        </Button>

        <Divider />

        <Button
          fullWidth
          color="inherit"
          size="large"
          variant="soft"
          onClick={() => handleSignUp('trainer')}
        >
          SignUp with Google as Trainer
        </Button>
      </Stack>
    </>
  );
}
