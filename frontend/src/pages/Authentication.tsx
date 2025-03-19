import { useState, useEffect } from 'react'
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Box, 
  Tabs, 
  Card,
  Title,
  Stack,
  Divider,
  Center,
  Alert,
  LoadingOverlay
} from '@mantine/core'
import { useForm } from '@mantine/form'
import useAuth from '../hooks/Authentication'

const Authentication = () => {
  const [activeTab, setActiveTab] = useState<string | null>('login');
  const { login, register, isLoading, error, clearError, isAuthenticated } = useAuth();

  // Form validation for login
  const loginForm = useForm({
    initialValues: {
      email: '',
      password: ''
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters')
    }
  });

  // Form validation for registration
  const registerForm = useForm({
    initialValues: {
      displayName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      displayName: (value) => (value.length > 0 ? null : 'Display name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 8 ? null : 'Password must be at least 8 characters'),
      confirmPassword: (value, values) => 
        value === values.password ? null : 'Passwords do not match'
    }
  });

  // Clear error when changing tabs
  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Redirect if already authenticated (you can replace this with actual navigation)
  useEffect(() => {
    if (isAuthenticated) {
      console.log('User is authenticated, should redirect to home page');
      // Add your redirect logic here once you have routing set up
    }
  }, [isAuthenticated]);

  // Handle login submit
  const handleLogin = (values: typeof loginForm.values) => {
    login(values.email, values.password);
  };

  // Handle registration submit
  const handleRegister = (values: typeof registerForm.values) => {
    register(values.email, values.password, values.displayName);
  };

  return (
    <Center style={{ height: '100vh' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 500, width: '100%', position: 'relative' }}>
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <Title order={2} ta="center" mt="md" mb="md">Welcome to Artify</Title>
        
        {error && (
          <Alert color="red" mb="md" withCloseButton onClose={clearError}>
            {error}
          </Alert>
        )}
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow>
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="register">Register</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login">
            <Box mt="md">
              <form onSubmit={loginForm.onSubmit(handleLogin)}>
                <Stack>
                  <TextInput
                    label="Email"
                    placeholder="your.email@example.com"
                    required
                    {...loginForm.getInputProps('email')}
                  />
                  
                  <PasswordInput
                    label="Password"
                    placeholder="Your password"
                    required
                    {...loginForm.getInputProps('password')}
                  />
                  
                  <Button fullWidth mt="md" type="submit">
                    Login
                  </Button>
                  
                  <Divider my="sm" label="Don't have an account?" labelPosition="center" />
                  
                  <Button 
                    variant="subtle" 
                    onClick={() => setActiveTab('register')}
                  >
                    Create Account
                  </Button>
                </Stack>
              </form>
            </Box>
          </Tabs.Panel>
          
          <Tabs.Panel value="register">
            <Box mt="md">
              <form onSubmit={registerForm.onSubmit(handleRegister)}>
                <Stack>
                  <TextInput
                    label="Display Name"
                    placeholder="Your name"
                    required
                    {...registerForm.getInputProps('displayName')}
                  />
                  
                  <TextInput
                    label="Email"
                    placeholder="your.email@example.com"
                    required
                    {...registerForm.getInputProps('email')}
                  />
                  
                  <PasswordInput
                    label="Password"
                    placeholder="Create a password"
                    required
                    {...registerForm.getInputProps('password')}
                  />
                  
                  <PasswordInput
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    required
                    {...registerForm.getInputProps('confirmPassword')}
                  />
                  
                  <Button fullWidth mt="md" type="submit">
                    Register
                  </Button>
                  
                  <Divider my="sm" label="Already have an account?" labelPosition="center" />
                  
                  <Button 
                    variant="subtle" 
                    onClick={() => setActiveTab('login')}
                  >
                    Login to your account
                  </Button>
                </Stack>
              </form>
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Center>
  )
}

export default Authentication