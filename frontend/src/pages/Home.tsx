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
  Paper,
  Loader,
  Notification,
  Progress,
  Box
} from "@mantine/core";
import { useDisclosure, useInterval } from '@mantine/hooks';
import { FaPlus, FaRobot, FaUpload, FaSearch, FaImage } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePromptStore from "../hooks/prompt";

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
  const navigate = useNavigate();
  
  // Modal states
  const [aiModalOpened, { open: openAiModal, close: closeAiModal }] = useDisclosure(false);
  const [importModalOpened, { open: openImportModal, close: closeImportModal }] = useDisclosure(false);
  
  // Form states
  const [aiPrompt, setAiPrompt] = useState("");
  const [importedFile, setImportedFile] = useState<File | null>(null);

  // Prompt store state and actions
  const { 
    generateImage, 
    getPrompt, 
    loading, 
    error, 
    clearError,
    getPromptUsage,
    usageStats
  } = usePromptStore();

  // Local state for tracking generation
  const [generatingPromptId, setGeneratingPromptId] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  // Polling for prompt status when generating
  const interval = useInterval(() => {
    if (generatingPromptId) {
      checkPromptStatus(generatingPromptId);
    }
  }, 2000);

  // Start polling when we have a promptId
  useEffect(() => {
    if (generatingPromptId) {
      interval.start();
      return interval.stop;
    }
  }, [generatingPromptId, interval]);

  // Load usage stats when component mounts
  useEffect(() => {
    getPromptUsage().catch(console.error);
  }, [getPromptUsage]);

  // Check the status of a generating prompt
  const checkPromptStatus = async (promptId: string) => {
    try {
      const prompt = await getPrompt(promptId);
      
      if (prompt.status === 'completed') {
        // Generation finished successfully
        setGenerationSuccess(true);
        setGeneratingPromptId(null);
        interval.stop();
        
        // If image was generated successfully and we're in the modal, close it
        if (prompt.imageUrl && aiModalOpened) {
          closeAiModal();
          
          // Navigate to the image or show it
          // For now, let's just show a success notification
          console.log("Image generated:", prompt.imageUrl);
        }
      } else if (prompt.status === 'failed') {
        // Generation failed
        setGeneratingPromptId(null);
        interval.stop();
      }
    } catch (error) {
      console.error("Error checking prompt status:", error);
    }
  };

  // Filter projects based on search term
  const filteredProjects = mockProjects.filter(project => 
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle AI generation
  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    
    try {
      // Clear any previous success
      setGenerationSuccess(false);
      
      // Call API to generate image
      const promptId = await generateImage(aiPrompt);
      
      // Store the promptId for status polling
      setGeneratingPromptId(promptId);
      
      // Optionally close modal if we want to show progress elsewhere
      // closeAiModal(); 
      
      // Clear the prompt text
      setAiPrompt("");
    } catch (error) {
      console.error("Error generating image:", error);
      // Error is already set in the store
    }
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

  // Handle create empty project
  const handleCreateEmptyProject = () => {
    // Generate a unique ID for the new project
    const newProjectId = Date.now().toString();
    navigate(`/canvas/${newProjectId}`);
  };

  // Handle project card click
  const handleProjectClick = (projectId: number) => {
    navigate(`/canvas/${projectId}`);
  };

  // Render usage limit information
  const renderUsageLimits = () => {
    if (!usageStats) return null;
    
    return (
      <Box mb="md">
        <Text size="sm" fw={500}>Image Generation Limits</Text>
        <Progress 
          value={(usageStats.dailyCount / usageStats.dailyLimit) * 100} 
          size="sm" 
          mt={5}
        />
        <Text size="xs" c="dimmed" mt={5}>
          {usageStats.dailyCount} of {usageStats.dailyLimit} daily generations used
        </Text>
      </Box>
    );
  };

  return (
    <Container size="xl" py="xl">
      {/* Error Notification */}
      {error && (
        <Notification 
          title="Error" 
          color="red" 
          onClose={clearError}
          mb="md"
        >
          {error}
        </Notification>
      )}

      {/* Success Notification */}
      {generationSuccess && (
        <Notification 
          title="Success" 
          color="green" 
          onClose={() => setGenerationSuccess(false)}
          mb="md"
        >
          Your image has been generated successfully! Check your gallery to view it.
        </Notification>
      )}

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
          
          {renderUsageLimits()}
          
          <Textarea
            placeholder="e.g. Create a minimalist logo for a coffee shop with mountains in the background"
            minRows={4}
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.currentTarget.value)}
            required
            disabled={loading || !!generatingPromptId}
          />
          
          {generatingPromptId && (
            <Group>
              <Loader size="sm" />
              <Text size="sm">Generating your image... This may take a moment.</Text>
            </Group>
          )}
          
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={closeAiModal} disabled={loading}>Cancel</Button>
            <Button 
              onClick={handleGenerateAI} 
              disabled={!aiPrompt.trim() || loading || !!generatingPromptId}
              leftSection={loading ? <Loader size="xs" color="white" /> : <FaRobot size={16} />}
              loading={loading || !!generatingPromptId}
            >
              {loading || generatingPromptId ? 'Generating...' : 'Generate'}
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
        <Button 
          leftSection={<FaPlus size={16} />} 
          variant="filled"
          onClick={handleCreateEmptyProject}
        >
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
            <Card 
              key={project.id} 
              shadow="sm" 
              padding="md" 
              radius="md" 
              withBorder
              onClick={() => handleProjectClick(project.id)}
              style={{ cursor: 'pointer' }}
            >
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