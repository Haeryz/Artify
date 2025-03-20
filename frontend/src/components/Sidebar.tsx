import { NavLink, Stack, Box, Flex } from "@mantine/core";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const mainLinks = [
    { label: "Home", path: "/" },
    { label: "Pricing", path: "/pricing" },
    { label: "Terms", path: "/terms" },
    { label: "Privacy", path: "/privacy" },
    { label: "Refunds", path: "/refunds" },
  ];

  const bottomLinks = [
    { label: "Login", path: "/authentication" },
  ];

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
        {bottomLinks.map((link) => (
          <NavLink
            key={link.path}
            label={link.label}
            component={Link}
            to={link.path}
            active={location.pathname === link.path}
            style={{ textDecoration: "none" }}
          />
        ))}
      </Box>
    </Flex>
  );
};

export default Sidebar;
