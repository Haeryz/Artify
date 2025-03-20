import { Group, Container, Anchor, Text } from '@mantine/core';
import { Link } from 'react-router-dom';

export function NavigationFooter() {
  return (
    <Container py="lg" size="md">
      <Group justify="center" gap={32}>
        <Anchor component={Link} to="/terms" color="dimmed" size="sm">
          Terms
        </Anchor>
        <Anchor component={Link} to="/privacy" color="dimmed" size="sm">
          Privacy
        </Anchor>
        <Anchor component={Link} to="/refunds" color="dimmed" size="sm">
          Refunds
        </Anchor>
        <Anchor component={Link} to="/" color="dimmed" size="sm">
          Home
        </Anchor>
      </Group>
      <Text ta="center" size="sm" color="dimmed" mt="sm">
        © {new Date().getFullYear()} Artify, Inc. All rights reserved.
      </Text>
    </Container>
  );
}

export default NavigationFooter;
