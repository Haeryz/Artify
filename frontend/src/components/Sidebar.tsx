import { NavLink, Stack, Box, Flex, Button, Group, Avatar, Text, Modal } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";
import useAuth from '../hooks/Authentication';
import { useState, useCallback } from 'react';
import { SuccessNotification } from './Notifications';

const Sidebar = () => {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);

  const mainLinks = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    { label: "Terms", path: "/terms" },
    { label: "Privacy", path: "/privacy" },
    { label: "Refunds", path: "/refunds" },
  ];

  const handleLogoutClick = useCallback(() => {
    setShowLogoutModal(true);
  }, []);

  const handleCancelLogout = useCallback(() => {
    setShowLogoutModal(false);
  }, []);

  const handleConfirmLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
      setShowLogoutModal(false);
      setShowLogoutSuccess(true);
      // Auto-hide success notification after 3 seconds
      setTimeout(() => setShowLogoutSuccess(false), 3000);
    } finally {
      setLoggingOut(false);
    }
  }, [logout]);

  return (
    <Flex 
      direction="column" 
      justify="space-between" 
      style={{ 
        padding: "1rem", 
        height: "100%" 
      }}
    >
      <Stack gap="xs">
        {mainLinks.map((link) => (
          <NavLink
            key={link.path}
            label={link.label}
            component={Link}
            to={link.path}
            active={location.pathname === link.path}
            style={{ textDecoration: "none" }}
          />
        ))}
      </Stack>

      <Box mt="auto">
        {isAuthenticated ? (
          <Stack>
            <Group>
              <Avatar 
                src={user?.photoURL || null} 
                color="blue" 
                radius="xl"
              >
                {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
              <Box>
                <Text size="sm" fw={500}>{user?.displayName || 'User'}</Text>
                <Text size="xs" c="dimmed">{user?.email || ''}</Text>
              </Box>
            </Group>
            <Button 
              color="red" 
              variant="light" 
              onClick={handleLogoutClick}
              fullWidth
              loading={loggingOut}
              loaderProps={{ size: 'xs' }}
            >
              Logout
            </Button>
          </Stack>
        ) : (
          <Button
            component={Link}
            to="/authentication"
            variant="filled"
            color="blue"
            fullWidth
          >
            Login
          </Button>
        )}
      </Box>

      {/* Logout confirmation modal */}
      <Modal
        opened={showLogoutModal}
        onClose={handleCancelLogout}
        title="Confirm Logout"
        size="sm"
        centered
      >
        <Text mb="md">Are you sure you want to log out?</Text>
        <Flex justify="flex-end" gap="md">
          <Button variant="subtle" onClick={handleCancelLogout}>
            Cancel
          </Button>
          <Button 
            color="red" 
            onClick={handleConfirmLogout}
            loading={loggingOut}
          >
            Logout
          </Button>
        </Flex>
      </Modal>

      {/* Success notification */}
      {showLogoutSuccess && (
        <Box
          style={{
            position: 'fixed',
            bottom: '1rem',
            right: '1rem',
            zIndex: 1000,
          }}
        >
          <SuccessNotification
            title="Logged Out"
            message="You have been successfully logged out."
            onClose={() => setShowLogoutSuccess(false)}
          />
        </Box>
      )}
    </Flex>
  );
};

export default Sidebar;
