import { useParams } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import {
  AppShell,
  Box,
  Button,
  ActionIcon,
  Group,
  Stack,
  Text,
  Tabs,
  Slider,
  ColorPicker,
  NumberInput,
  Select,
  ScrollArea,
  Tooltip,
  Divider,
  Paper,
  Grid,
  Input,
  Flex,
  Accordion,
  rem,
} from "@mantine/core";
import {
  FaMousePointer,
  FaBrush,
  FaPen,
  FaEraser,
  FaCrop,
  FaShapes,
  FaFont,
  FaMagic,
  FaEyeDropper,
  FaLayerGroup,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaLockOpen,
  FaCopy,
  FaTrash,
  FaPlus,
  FaUndo,
  FaRedo,
  FaSave,
  FaDownload,
  FaHandPaper,
  FaFill,
  FaSearch,
} from "react-icons/fa";

// Fake data for layers
const initialLayers = [
  { id: 1, name: "Background", visible: true, locked: false, type: "image" },
  { id: 2, name: "Text Layer", visible: true, locked: false, type: "text" },
  { id: 3, name: "Shape Layer", visible: true, locked: false, type: "shape" },
];

// Tool definitions
const tools = [
  { id: "select", icon: FaMousePointer, name: "Select" },
  { id: "move", icon: FaHandPaper, name: "Move" },
  { id: "brush", icon: FaBrush, name: "Brush" },
  { id: "pen", icon: FaPen, name: "Pen" },
  { id: "eraser", icon: FaEraser, name: "Eraser" },
  { id: "crop", icon: FaCrop, name: "Crop" },
  { id: "shapes", icon: FaShapes, name: "Shapes" },
  { id: "text", icon: FaFont, name: "Text" },
  { id: "fill", icon: FaFill, name: "Fill" },
  { id: "eyedropper", icon: FaEyeDropper, name: "Color Picker" },
  { id: "magic", icon: FaMagic, name: "Magic Wand" },
];

const Canvas = () => {
  const { id } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState("select");
  const [layers, setLayers] = useState(initialLayers);
  const [brushSize, setBrushSize] = useState(5);
  const [color, setColor] = useState("#1C7ED6");
  const [opacity, setOpacity] = useState(100);
  const [zoom, setZoom] = useState(100);
  const [selectedLayerId, setSelectedLayerId] = useState<number | null>(1);

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Set up canvas background
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Display project ID for debugging
    console.log("Project ID:", id);
  }, [id]);

  // Handle tool selection
  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
  };

  // Layer operations
  const toggleLayerVisibility = (layerId: number) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const toggleLayerLock = (layerId: number) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
      )
    );
  };

  const deleteLayer = (layerId: number) => {
    setLayers(layers.filter((layer) => layer.id !== layerId));
    if (selectedLayerId === layerId) {
      setSelectedLayerId(layers.length > 1 ? layers[0].id : null);
    }
  };

  const addNewLayer = () => {
    const newLayer = {
      id: Date.now(),
      name: `Layer ${layers.length + 1}`,
      visible: true,
      locked: false,
      type: "empty",
    };
    setLayers([...layers, newLayer]);
    setSelectedLayerId(newLayer.id);
  };

  // Tool-specific property panel
  const renderToolProperties = () => {
    switch (selectedTool) {
      case "brush":
        return (
          <Stack gap="xs">
            <Text size="sm">Brush Size</Text>
            <Slider
              value={brushSize}
              onChange={setBrushSize}
              min={1}
              max={100}
              step={1}
              label={(value) => `${value}px`}
              marks={[
                { value: 1, label: "1px" },
                { value: 50, label: "50px" },
                { value: 100, label: "100px" },
              ]}
            />
            <Text size="sm" mt="md">
              Opacity
            </Text>
            <Slider
              value={opacity}
              onChange={setOpacity}
              min={0}
              max={100}
              step={1}
              label={(value) => `${value}%`}
            />
            <Text size="sm" mt="md">
              Color
            </Text>
            <ColorPicker format="hex" value={color} onChange={setColor} />
          </Stack>
        );
      case "text":
        return (
          <Stack gap="xs">
            <Text size="sm">Font</Text>
            <Select
              data={[
                "Arial",
                "Times New Roman",
                "Courier",
                "Georgia",
                "Verdana",
              ]}
              defaultValue="Arial"
            />
            <Grid columns={2} gutter="xs">
              <Grid.Col span={1}>
                <Text size="sm">Size</Text>
                <NumberInput defaultValue={16} min={8} max={200} />
              </Grid.Col>
              <Grid.Col span={1}>
                <Text size="sm">Line Height</Text>
                <NumberInput defaultValue={1.5} min={0.5} max={3} step={0.1} />
              </Grid.Col>
            </Grid>
            <Text size="sm" mt="md">
              Color
            </Text>
            <ColorPicker format="hex" value={color} onChange={setColor} />
          </Stack>
        );
      case "shapes":
        return (
          <Stack gap="xs">
            <Text size="sm">Shape Type</Text>
            <Select
              data={["Rectangle", "Ellipse", "Polygon", "Line", "Custom"]}
              defaultValue="Rectangle"
            />
            <Text size="sm" mt="md">
              Fill Color
            </Text>
            <ColorPicker format="hex" value={color} onChange={setColor} />
            <Text size="sm" mt="md">
              Stroke Width
            </Text>
            <NumberInput defaultValue={1} min={0} max={20} />
            <Text size="sm" mt="md">
              Stroke Color
            </Text>
            <ColorPicker format="hex" value="#000000" />
          </Stack>
        );
      default:
        return (
          <Stack gap="xs">
            <Text size="sm" c="dimmed">
              Select a tool to see its properties
            </Text>
          </Stack>
        );
    }
  };

  return (
    <AppShell
      padding={0}
      navbar={{ width: 60, breakpoint: "sm" }}
      aside={{ width: 300, breakpoint: "sm" }}
      header={{ height: 60 }}
    >
      {/* Tools Sidebar (Left) */}
      <AppShell.Navbar p="xs">
        <Stack gap="xs" align="center">
          {tools.map((tool) => (
            <Tooltip key={tool.id} label={tool.name} position="right" withArrow>
              <ActionIcon
                variant={selectedTool === tool.id ? "filled" : "subtle"}
                color={selectedTool === tool.id ? "blue" : "gray"}
                size="lg"
                radius="md"
                onClick={() => handleToolSelect(tool.id)}
              >
                <tool.icon style={{ width: rem(18), height: rem(18) }} />
              </ActionIcon>
            </Tooltip>
          ))}
        </Stack>
      </AppShell.Navbar>

      {/* Top Header - Tool Properties */}
      <AppShell.Header p="xs">
        <Flex justify="space-between" align="center" h="100%">
          <Group>
            <Text fw={600}>Project: {id}</Text>
          </Group>

          <Group gap="xs">
            <Button
              variant="subtle"
              size="xs"
              leftSection={<FaUndo size={14} />}
            >
              Undo
            </Button>
            <Button
              variant="subtle"
              size="xs"
              leftSection={<FaRedo size={14} />}
            >
              Redo
            </Button>
            <Divider orientation="vertical" />
            <Group>
              <Text size="sm">Zoom:</Text>
              <Select
                size="xs"
                w={90}
                value={zoom.toString()}
                onChange={(value) => setZoom(Number(value))}
                data={["25", "50", "75", "100", "150", "200", "300"]}
                rightSection={<Text size="xs">%</Text>}
              />
            </Group>
            <Divider orientation="vertical" />
            <Button
              variant="light"
              size="xs"
              leftSection={<FaSave size={14} />}
            >
              Save
            </Button>
            <Button
              variant="light"
              size="xs"
              leftSection={<FaDownload size={14} />}
            >
              Export
            </Button>
          </Group>
        </Flex>
      </AppShell.Header>

      {/* Layers & Properties Sidebar (Right) */}
      <AppShell.Aside p="xs">
        <Tabs defaultValue="layers">
          <Tabs.List>
            <Tabs.Tab value="layers" leftSection={<FaLayerGroup size={14} />}>
              Layers
            </Tabs.Tab>
            <Tabs.Tab value="properties" leftSection={<FaSearch size={14} />}>
              Properties
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="layers" pt="xs">
            <Box mb="sm">
              <Group justify="space-between">
                <Text size="sm" fw={500}>
                  Layers
                </Text>
                <Group gap={5}>
                  <ActionIcon size="sm" variant="subtle" onClick={addNewLayer}>
                    <FaPlus size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    disabled={!selectedLayerId}
                  >
                    <FaCopy size={12} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    disabled={!selectedLayerId}
                    onClick={() =>
                      selectedLayerId && deleteLayer(selectedLayerId)
                    }
                  >
                    <FaTrash size={12} />
                  </ActionIcon>
                </Group>
              </Group>
            </Box>

            <ScrollArea h={500}>
              <Stack gap="xs">
                {layers.map((layer) => (
                  <Paper
                    key={layer.id}
                    withBorder
                    p="xs"
                    style={{
                      opacity: layer.visible ? 1 : 0.5,
                      backgroundColor:
                        selectedLayerId === layer.id
                          ? "#f0f9ff"
                          : "transparent",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedLayerId(layer.id)}
                  >
                    <Group justify="space-between">
                      <Group gap="xs">
                        <ActionIcon
                          size="sm"
                          variant="transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLayerVisibility(layer.id);
                          }}
                        >
                          {layer.visible ? (
                            <FaEye size={12} />
                          ) : (
                            <FaEyeSlash size={12} />
                          )}
                        </ActionIcon>
                        <Text size="sm">{layer.name}</Text>
                      </Group>
                      <ActionIcon
                        size="sm"
                        variant="transparent"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLayerLock(layer.id);
                        }}
                      >
                        {layer.locked ? (
                          <FaLock size={12} />
                        ) : (
                          <FaLockOpen size={12} />
                        )}
                      </ActionIcon>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            </ScrollArea>
          </Tabs.Panel>

          <Tabs.Panel value="properties" pt="xs">
            <Accordion>
              <Accordion.Item value="toolProperties">
                <Accordion.Control>
                  <Group gap="xs">
                    {tools
                      .find((t) => t.id === selectedTool)
                      ?.icon({ size: 14 })}
                    <Text size="sm">
                      {tools.find((t) => t.id === selectedTool)?.name || "Tool"}{" "}
                      Properties
                    </Text>
                  </Group>
                </Accordion.Control>
                <Accordion.Panel>{renderToolProperties()}</Accordion.Panel>
              </Accordion.Item>

              {selectedLayerId && (
                <Accordion.Item value="layerProperties">
                  <Accordion.Control>
                    <Group gap="xs">
                      <FaLayerGroup size={14} />
                      <Text size="sm">Layer Properties</Text>
                    </Group>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      <Input
                        placeholder="Layer name"
                        defaultValue={
                          layers.find((l) => l.id === selectedLayerId)?.name
                        }
                      />
                      <Text size="sm">Blend Mode</Text>
                      <Select
                        data={[
                          "Normal",
                          "Multiply",
                          "Screen",
                          "Overlay",
                          "Darken",
                          "Lighten",
                        ]}
                        defaultValue="Normal"
                      />
                      <Text size="sm">Opacity</Text>
                      <Slider defaultValue={100} min={0} max={100} />
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              )}
            </Accordion>
          </Tabs.Panel>
        </Tabs>
      </AppShell.Aside>

      {/* Main Canvas Area */}
      <AppShell.Main
        style={{
          backgroundColor: "#f1f3f5",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          style={{
            position: "relative",
            overflow: "auto",
            width: "100%",
            height: "100%",
          }}
        >
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) scale(${zoom / 100})`,
              boxShadow: "0 0 20px rgba(0, 0, 0, 0.15)",
            }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              style={{
                backgroundColor: "white",
                display: "block",
              }}
            />
          </Box>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
};

export default Canvas;
