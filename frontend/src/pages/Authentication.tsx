import { useState, useEffect, useCallback, JSX } from 'react'
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Box, 
  Tabs, 
  Title,
  Stack,
  Divider,
  LoadingOverlay,
  Group,
  Text,
  Transition,
  Paper,
  Container,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import useAuth from '../hooks/Authentication'
import { signInWithGoogle } from '../utils/firebase'
import { 
  ErrorNotification,
  SuccessNotification,
  WeakPasswordNotification,
  PasswordMismatchNotification,
  AccountCreatedNotification
} from '../components/Notifications'
import NavigationFooter from "../components/NavigationFooter";
import { useNavigate } from 'react-router-dom'

const Authentication = () => {
  const [activeTab, setActiveTab] = useState<string | null>('login');
  const { login, register, isLoading, error, clearError, isAuthenticated, logout, user } = useAuth();
  const [notification, setNotification] = useState<JSX.Element | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const navigate = useNavigate();

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

  // Memoize clearError function to avoid effect re-triggering
  const handleClearError = useCallback(() => {
    clearError();
  }, [clearError]);

  // Clear error when changing tabs
  useEffect(() => {
    handleClearError();
    setNotification(null);
     
  }, [activeTab, handleClearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Redirect to home page after short delay to show success message
      const timer = setTimeout(() => {
        navigate('/');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  // Handle login submit - wrapping in useCallback to prevent re-renders
  const handleLogin = useCallback((values: typeof loginForm.values) => {
    login(values.email, values.password);
  }, [login, loginForm]);

  // Handle registration submit - wrapping in useCallback to prevent re-renders
  const handleRegister = useCallback((values: typeof registerForm.values) => {
    // Check if passwords match before submitting
    if (values.password !== values.confirmPassword) {
      setNotification(<PasswordMismatchNotification onClose={() => setNotification(null)} />);
      return;
    }
    
    // Check password strength
    if (values.password.length < 8) {
      setNotification(<WeakPasswordNotification onClose={() => setNotification(null)} />);
      return;
    }
    
    // Set flag to indicate registration attempt
    setRegistrationSuccess(true);
    register(values.email, values.password, values.displayName);
  }, [register, registerForm]);

  // Handle Google login
  const handleGoogleLogin = useCallback(async () => {
    try {
      setNotification(null);
      // Only get the ID token from Google auth flow
      const { idToken } = await signInWithGoogle();
      // Send the token to your backend for verification and login
      await useAuth.getState().googleLogin(idToken);
    } catch (error) {
      console.error('Google sign-in error:', error);
      setNotification(
        <ErrorNotification 
          title="Google Login Error" 
          message="Failed to sign in with Google. Please try again."
          onClose={() => setNotification(null)}
        />
      );
    }
  }, []);

  // Show error notification based on the error message
  useEffect(() => {
    if (error) {
      setNotification(
        <ErrorNotification 
          title="Authentication Error" 
          message={error} 
          onClose={handleClearError}
        />
      );
      // Reset registration success flag if there was an error
      setRegistrationSuccess(false);
    } else if (isAuthenticated && registrationSuccess) {
      // Show account created notification specifically for registration success
      setNotification(
        <AccountCreatedNotification onClose={() => setNotification(null)} />
      );
      // Reset flag after showing notification
      setRegistrationSuccess(false);
    } else if (isAuthenticated && !registrationSuccess) {
      // For regular login success
      setNotification(
        <SuccessNotification
          title="Login Successful"
          message="You have been successfully authenticated."
          onClose={() => setNotification(null)}
        />
      );
    }
  }, [error, isAuthenticated, handleClearError, registrationSuccess]);

  // Google icon with proper Google colors
  const googleIconSvg = (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="18" 
      height="18" 
      viewBox="0 0 48 48"
    >
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );

  // Handle logout
  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <Container size="sm" py="xl">
      <Transition mounted={true} transition="fade" duration={400} timingFunction="ease">
        {(styles) => (
          <div style={styles}>
            <Paper
              radius="md"
              p="xl"
              withBorder
              shadow="md"
              style={{
                backdropFilter: "blur(10px)",
                backgroundColor: 'rgba(255, 255, 255, 0.85)', // Always use light theme background
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Background pattern */}
              <div 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  opacity: 0.04,
                  backgroundImage: 'radial-gradient(circle, rgba(0,0,0,1) 10%, transparent 10.5%), radial-gradient(circle, rgba(0,0,0,1) 10%, transparent 10.5%)',
                  backgroundSize: '30px 30px',
                  backgroundPosition: '0 0, 15px 15px',
                  pointerEvents: 'none',
                  zIndex: 0
                }}
              />
              
              <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2, backgroundOpacity: 0.7 }} />
              
              <Group justify="space-between" align="center" mb="lg">
                <Box>
                  <Title order={2} ta="left">Welcome to Artify</Title>
                  <Text c="dimmed" size="sm">Transform your ideas into art with AI</Text>
                </Box>
                
                {isAuthenticated && (
                  <Button 
                    color="red" 
                    variant="light" 
                    onClick={handleLogout}
                    size="sm"
                  >
                    Logout
                  </Button>
                )}
              </Group>
              
              {notification && (
                <Box mb="md">
                  {notification}
                </Box>
              )}
              
              {!isAuthenticated ? (
                <Tabs value={activeTab} onChange={setActiveTab} radius="md">
                  <Tabs.List grow mb="md">
                    <Tabs.Tab 
                      value="login" 
                      fw={activeTab === 'login' ? 600 : 400}
                    >
                      Sign In
                    </Tabs.Tab>
                    <Tabs.Tab 
                      value="register" 
                      fw={activeTab === 'register' ? 600 : 400}
                    >
                      Create Account
                    </Tabs.Tab>
                  </Tabs.List>

                  <Tabs.Panel value="login">
                    <form onSubmit={loginForm.onSubmit(handleLogin)}>
                      <Stack>
                        <TextInput
                          label="Email"
                          placeholder="your.email@example.com"
                          required
                          radius="md"
                          size="md"
                          {...loginForm.getInputProps('email')}
                        />
                        
                        <PasswordInput
                          label="Password"
                          placeholder="Your password"
                          required
                          radius="md"
                          size="md"
                          {...loginForm.getInputProps('password')}
                        />
                        
                        <Button 
                          fullWidth 
                          mt="md" 
                          type="submit"
                          size="md"
                          radius="md"
                          gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                          variant="gradient"
                        >
                          Sign In
                        </Button>
                        
                        <Divider label="or continue with" labelPosition="center" my="sm" />
                        
                        <Button 
                          fullWidth 
                          variant="default" 
                          leftSection={googleIconSvg}
                          type="button"
                          onClick={handleGoogleLogin}
                          radius="md"
                          size="md"
                        >
                          Google
                        </Button>
                        
                        <Text size="sm" ta="center" mt="sm">
                          Don't have an account?{' '}
                          <Text 
                            span 
                            c="blue" 
                            td="underline" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('register')}
                          >
                            Create one
                          </Text>
                        </Text>
                      </Stack>
                    </form>
                  </Tabs.Panel>
                  
                  <Tabs.Panel value="register">
                    <form onSubmit={registerForm.onSubmit(handleRegister)}>
                      <Stack>
                        <TextInput
                          label="Display Name"
                          placeholder="Your name"
                          required
                          radius="md"
                          size="md"
                          {...registerForm.getInputProps('displayName')}
                        />
                        
                        <TextInput
                          label="Email"
                          placeholder="your.email@example.com"
                          required
                          radius="md"
                          size="md"
                          {...registerForm.getInputProps('email')}
                        />
                        
                        <PasswordInput
                          label="Password"
                          placeholder="Create a password"
                          required
                          radius="md"
                          size="md"
                          {...registerForm.getInputProps('password')}
                        />
                        
                        <PasswordInput
                          label="Confirm Password"
                          placeholder="Confirm your password"
                          required
                          radius="md"
                          size="md"
                          {...registerForm.getInputProps('confirmPassword')}
                        />
                        
                        <Button 
                          fullWidth 
                          mt="md" 
                          type="submit"
                          size="md"
                          radius="md"
                          gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}
                          variant="gradient"
                        >
                          Create Account
                        </Button>
                        
                        <Text size="sm" ta="center" mt="sm">
                          Already have an account?{' '}
                          <Text 
                            span 
                            c="blue" 
                            td="underline" 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setActiveTab('login')}
                          >
                            Sign in
                          </Text>
                        </Text>
                      </Stack>
                    </form>
                  </Tabs.Panel>
                </Tabs>
              ) : (
                <Box py="md">
                  <SuccessNotification
                    title="Authentication Successful"
                    message={`Welcome back, ${user?.displayName || 'User'}! You are now logged in.`}
                  />
                  <Button 
                    fullWidth 
                    mt="md" 
                    color="red" 
                    onClick={handleLogout}
                    radius="md"
                    size="md"
                  >
                    Logout
                  </Button>
                </Box>
              )}
            </Paper>
          </div>
        )}
      </Transition>
      <NavigationFooter />
    </Container>
  )
}

export default Authentication