import { useState } from 'react';
import { 
  Container, 
  Title, 
  Grid, 
  Card, 
  Text, 
  Badge, 
  List, 
  ThemeIcon, 
  Button, 
  Group, 
  Switch, 
  useMantineTheme,
  Stack,
  rem,
  Box,
  Center
} from '@mantine/core';
import { FaCheck, FaTimes, FaStar } from 'react-icons/fa';
import NavigationFooter from '../components/NavigationFooter';

export function Pricing() {
  const [annually, setAnnually] = useState(false);
  const theme = useMantineTheme();

  // Price multiplier for annual billing (20% discount)
  const annualMultiplier = 0.8;

  // Define the pricing plans
  const plans = [
    {
      title: 'Free',
      price: 0,
      features: [
        { text: '5 AI image generations per day', included: true },
        { text: 'Basic photo editing tools', included: true },
        { text: 'Standard resolution exports', included: true },
        { text: 'Limited templates', included: true },
        { text: 'Community support', included: true },
        { text: 'Advanced editing features', included: false },
        { text: 'Priority support', included: false },
        { text: 'Commercial usage rights', included: false },
      ],
      buttonText: 'Get Started',
      buttonVariant: 'outline' as const,
    },
    {
      title: 'Basic',
      price: 5,
      features: [
        { text: '50 AI image generations per day', included: true },
        { text: 'All basic editing tools', included: true },
        { text: 'HD resolution exports', included: true },
        { text: 'All standard templates', included: true },
        { text: 'Email support', included: true },
        { text: 'Advanced filters and effects', included: true },
        { text: 'Priority support', included: false },
        { text: 'Commercial usage rights', included: true },
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'filled' as const,
      recommended: true,
    },
    {
      title: 'Pro',
      price: 15,
      features: [
        { text: 'Unlimited AI image generations', included: true },
        { text: 'Complete editing suite', included: true },
        { text: '4K resolution exports', included: true },
        { text: 'All premium templates', included: true },
        { text: 'Priority email & chat support', included: true },
        { text: 'Advanced AI editing tools', included: true },
        { text: 'White-label exports', included: true },
        { text: 'Full commercial usage rights', included: true },
      ],
      buttonText: 'Subscribe',
      buttonVariant: 'filled' as const,
    },
  ];

  return (
    <>
      <Container size="xl" py={80}>
        <Stack gap={40}>
          <Box>
            <Title ta="center" order={1}>Simple, Transparent Pricing</Title>
            <Text ta="center" c="dimmed" size="lg" mt="sm">
              Choose the perfect plan for your creative needs
            </Text>
          </Box>

          <Center>
            <Group>
              <Text fw={500}>Monthly</Text>
              <Switch 
                checked={annually} 
                onChange={(event) => setAnnually(event.currentTarget.checked)}
                size="lg"
                label={
                  <Badge variant="filled" color="green" ml={5}>
                    Save 20%
                  </Badge>
                }
              />
              <Text fw={500}>Annually</Text>
            </Group>
          </Center>

          <Grid>
            {plans.map((plan) => (
              <Grid.Col key={plan.title} span={{ base: 12, sm: 6, md: 4 }}>
                <Card
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  styles={(theme) => ({
                    root: {
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderColor: plan.recommended 
                        ? theme.colors[theme.primaryColor][5]
                        : undefined,
                      transform: plan.recommended ? 'scale(1.05)' : 'scale(1)',
                      zIndex: plan.recommended ? 2 : 1,
                      position: 'relative',
                    }
                  })}
                >
                  {plan.recommended && (
                    <Badge 
                      color="primary" 
                      variant="filled"
                      style={{
                        position: 'absolute',
                        top: -10,
                        right: 20,
                      }}
                    >
                      Most Popular
                    </Badge>
                  )}

                  <Title order={3}>{plan.title}</Title>
                  
                  <Group gap={5} my="md">
                    <Text size="xl" fw={700} style={{ fontSize: rem(36) }}>
                      ${annually 
                        ? Math.round(plan.price * 12 * annualMultiplier) 
                        : plan.price}
                    </Text>
                    <Box mt={10}>
                      <Text fw={400} c="dimmed">
                        {plan.price === 0 
                          ? 'forever' 
                          : annually ? '/year' : '/month'}
                      </Text>
                    </Box>
                  </Group>

                  {annually && plan.price > 0 && (
                    <Text size="sm" c="dimmed" mb="md">
                      ${plan.price}/month billed annually
                    </Text>
                  )}

                  <List
                    spacing="sm"
                    size="sm"
                    center
                    my="md"
                    styles={{
                      itemWrapper: {
                        display: 'flex',
                        alignItems: 'flex-start',
                      }
                    }}
                    style={{ flexGrow: 1 }}
                  >
                    {plan.features.map((feature, index) => (
                      <List.Item
                        key={index}
                        icon={
                          <ThemeIcon 
                            color={feature.included ? 'green' : 'gray'} 
                            size={24} 
                            radius="xl"
                          >
                            {feature.included ? <FaCheck size={12} /> : <FaTimes size={12} />}
                          </ThemeIcon>
                        }
                      >
                        <Text c={feature.included ? 'dark' : 'dimmed'}>
                          {feature.text}
                        </Text>
                      </List.Item>
                    ))}
                  </List>

                  <Button
                    variant={plan.buttonVariant}
                    radius="md"
                    style={{ marginTop: 'auto' }}
                    color={plan.recommended ? 'primary' : undefined}
                    fullWidth
                  >
                    {plan.buttonText}
                  </Button>
                </Card>
              </Grid.Col>
            ))}
          </Grid>

          <Box my="xl">
            <Title order={3} ta="center" mb="md">All Plans Include</Title>
            <Grid>
              {[
                'Web & Mobile Access',
                'Secure Cloud Storage',
                'Regular Feature Updates',
                'Cancel Anytime',
                'GDPR Compliance',
                'SSL Encryption'
              ].map((feature) => (
                <Grid.Col key={feature} span={{ base: 12, xs: 6, md: 4 }}>
                  <Group>
                    <ThemeIcon color="primary" size={24} radius="xl">
                      <FaStar size={12} />
                    </ThemeIcon>
                    <Text>{feature}</Text>
                  </Group>
                </Grid.Col>
              ))}
            </Grid>
          </Box>

          <Box bg="gray.0" p="xl" style={{ border: `1px solid ${theme.colors.gray[3]}`, borderRadius: theme.radius.md }}>
            <Title order={4}>Need an Enterprise Solution?</Title>
            <Text>
              Our enterprise plans offer advanced features, custom integrations, dedicated support,
              and volume pricing for teams of all sizes.
            </Text>
            <Button variant="outline" color="dark" mt="md">
              Contact Sales
            </Button>
          </Box>
        </Stack>
      </Container>

      <NavigationFooter />
    </>
  );
}

export default Pricing;
