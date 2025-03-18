import React, { useState } from 'react'
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
  Center
} from '@mantine/core'

const Authentication = () => {
  const [activeTab, setActiveTab] = useState<string | null>('login');

  return (
    <Center style={{ height: '100vh' }}>
      <Card shadow="sm" padding="lg" radius="md" withBorder style={{ maxWidth: 500, width: '100%' }}>
        <Title order={2} ta="center" mt="md" mb="md">Welcome to Artify</Title>
        
        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List grow>
            <Tabs.Tab value="login">Login</Tabs.Tab>
            <Tabs.Tab value="register">Register</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login">
            <Box mt="md">
              <Stack>
                <TextInput
                  label="Email"
                  placeholder="your.email@example.com"
                  required
                />
                
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  required
                />
                
                <Button fullWidth mt="md">Login</Button>
                
                <Divider my="sm" label="Don't have an account?" labelPosition="center" />
                
                <Button 
                  variant="subtle" 
                  onClick={() => setActiveTab('register')}
                >
                  Create Account
                </Button>
              </Stack>
            </Box>
          </Tabs.Panel>
          
          <Tabs.Panel value="register">
            <Box mt="md">
              <Stack>
                <TextInput
                  label="Display Name"
                  placeholder="Your name"
                  required
                />
                
                <TextInput
                  label="Email"
                  placeholder="your.email@example.com"
                  required
                />
                
                <PasswordInput
                  label="Password"
                  placeholder="Create a password"
                  required
                />
                
                <PasswordInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  required
                />
                
                <Button fullWidth mt="md">Register</Button>
                
                <Divider my="sm" label="Already have an account?" labelPosition="center" />
                
                <Button 
                  variant="subtle" 
                  onClick={() => setActiveTab('login')}
                >
                  Login to your account
                </Button>
              </Stack>
            </Box>
          </Tabs.Panel>
        </Tabs>
      </Card>
    </Center>
  )
}

export default Authentication