import { Burger, Flex, Text } from '@mantine/core';

interface NavbarProps {
  toggleMobile: () => void;
  toggleDesktop: () => void;
  mobileOpened: boolean;
  desktopOpened: boolean;
}

const Navbar = ({ toggleMobile, toggleDesktop, mobileOpened, desktopOpened }: NavbarProps) => {
  return (
    <Flex align="center" gap="md" p="md">
      {/* Mobile burger - only visible on small screens */}
      <Burger 
        opened={mobileOpened}
        onClick={toggleMobile}
        aria-label="Toggle mobile navigation"
        hiddenFrom="sm"
      />
      
      {/* Desktop burger - only visible on larger screens */}
      <Burger 
        opened={desktopOpened}
        onClick={toggleDesktop}
        aria-label="Toggle desktop navigation"
        visibleFrom="sm"
      />
      
      <Text size="xl" fw={700}>Artify</Text>
    </Flex>
  );
};

export default Navbar;