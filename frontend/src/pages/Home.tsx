import { 
  Button, 
  Container, 
  Group, 
  Text, 
  Card, 
  Image, 
  SimpleGrid, 
  TextInput, 
  Badge,
  Stack,
  Modal,
  Textarea,
  FileInput,
  Paper
} from "@mantine/core";
import { useDisclosure } from '@mantine/hooks';
import { FaPlus, FaRobot, FaUpload, FaSearch, FaImage } from "react-icons/fa";
import { useState } from "react";

// Mock data for demonstration
const mockProjects = [
  {
    id: 1,
    title: "Website Redesign",
    image: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?q=80&w=500",
    lastOpened: "2 hours ago"
  },
  {
    id: 2,
    title: "Logo Collection",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=500",
    lastOpened: "Yesterday"
  },
  {
    id: 3,
    title: "Social Media Assets",
    image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?q=80&w=500",
    lastOpened: "3 days ago"
  },
  {
    id: 4,
    title: "Brand Guidelines",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500",
    lastOpened: "Last week"
  },
  {
    id: 5,
    title: "Mobile App Design",
    image: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=500",
    lastOpened: "2 weeks ago"
  },
];

const Home = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter] = useState("recent"); // Could be expanded with more filter options
  
  // Modal states
  const [aiModalOpened, { open: openAiModal, close: closeAiModal }] = useDisclosure(false);
  const [importModalOpened, { open: openImportModal, close: closeImportModal }] = useDisclosure(false);
  
  // Form states
  const [aiPrompt, setAiPrompt] = useState("");
  const [importedFile, setImportedFile] = useState<File | null>(null);

  // Filter projects based on search term
  const filteredProjects = mockProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle AI generation
  const handleGenerateAI = () => {
    // This would connect to your AI generation service
    console.log("Generating with prompt:", aiPrompt);
    // Close modal after submission
    closeAiModal();
    setAiPrompt("");
  };
  
  // Handle file import
  const handleImportFile = () => {
    if (importedFile) {
      console.log("Importing file:", importedFile.name);
      // Process the file here
      closeImportModal();
      setImportedFile(null);
    }
  };

  return (
    <Container size="xl" py="xl">
      {/* AI Generation Modal */}
      <Modal 
        opened={aiModalOpened} 
        onClose={closeAiModal} 
        title="Generate with AI" 
        centered
        size="lg"
      >
        <Stack>
          <Text size="sm">Describe what you want to create and our AI will generate it for you.</Text>
          <Textarea
            placeholder="e.g. Create a minimalist logo for a coffee shop with mountains in the background"
            minRows={4}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.currentTarget.value)}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={closeAiModal}>Cancel</Button>
            <Button 
              onClick={handleGenerateAI} 
              disabled={!aiPrompt.trim()}
              leftSection={<FaRobot size={16} />}
            >
              Generate
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Import Modal */}
      <Modal 
        opened={importModalOpened} 
        onClose={closeImportModal} 
        title="Import from Computer" 
        centered
        size="md"
      >
        <Stack>
          <Text size="sm">Select a project file or image to import.</Text>
          <Paper withBorder p="md" radius="md">
            <FileInput
              placeholder="Click to select file"
              value={importedFile}
              onChange={setImportedFile}
              accept="image/png,image/jpeg,image/gif,application/json"
              leftSection={<FaImage size={16} />}
              clearable
            />
          </Paper>
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={closeImportModal}>Cancel</Button>
            <Button 
              onClick={handleImportFile} 
              disabled={!importedFile}
              leftSection={<FaUpload size={16} />}
            >
              Import
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Project Creation Actions */}
      <Group justify="center" mb="xl">
        <Button leftSection={<FaPlus size={16} />} variant="filled">
          Create Empty Project
        </Button>
        <Button 
          leftSection={<FaRobot size={16} />} 
          variant="light"
          onClick={openAiModal}
        >
          Generate with AI
        </Button>
        <Button 
          leftSection={<FaUpload size={16} />} 
          variant="outline"
          onClick={openImportModal}
        >
          Import from Computer
        </Button>
      </Group>

      {/* Filter Section */}
      <Group justify="space-between" mb="md">
        <Badge size="lg" variant="light">
          {filter === "recent" ? "Recently Opened" : "All Projects"}
        </Badge>
        <TextInput
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          leftSection={<FaSearch size={16} />}
          style={{ width: 250 }}
        />
      </Group>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 3, md: 4 }} spacing="md">
          {filteredProjects.map((project) => (
            <Card key={project.id} shadow="sm" padding="md" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={project.image}
                  height={160}
                  alt={project.title}
                />
              </Card.Section>

              <Stack mt="md" gap="xs">
                <Text fw={500}>{project.title}</Text>
                <Text size="xs" c="dimmed">Last opened: {project.lastOpened}</Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Text ta="center" mt="xl" c="dimmed">
          No projects found. Create a new project to get started.
        </Text>
      )}
    </Container>
  );
};

export default Home;