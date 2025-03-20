import { Box, Container, Title, Text, Space, Divider } from '@mantine/core';

const Privacy = () => {
  return (
    <Container size="md" py="xl">
      <Title order={1}>Privacy Policy</Title>
      <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
      <Space h="md" />
      
      <Text>
        This Privacy Policy describes how Artify Inc. ("we", "our", or "us") collects, uses, and discloses your 
        personal information when you use our platform.
      </Text>

      <Space h="md" />
      <Divider />
      <Space h="md" />

      <Title order={2}>1. Information We Collect</Title>
      <Text>
        <strong>Personal Information:</strong> When you create an account, we collect your name, email address, and 
        other information you provide.
      </Text>
      <Text>
        <strong>Payment Information:</strong> When you make a purchase, our payment processor (Paddle) collects 
        payment information. We do not store your full payment details on our servers.
      </Text>
      <Text>
        <strong>Usage Information:</strong> We collect information about how you interact with our platform, 
        including IP address, browser type, pages visited, and time spent.
      </Text>

      <Space h="md" />

      <Title order={2}>2. How We Use Your Information</Title>
      <Text>We use your information to:</Text>
      <Box component="ul">
        <Box component="li">Provide, maintain, and improve our platform</Box>
        <Box component="li">Process transactions and send related information</Box>
        <Box component="li">Send administrative messages, updates, and marketing messages</Box>
        <Box component="li">Respond to your comments, questions, and requests</Box>
        <Box component="li">Monitor and analyze trends, usage, and activities</Box>
        <Box component="li">Detect, investigate, and prevent fraudulent transactions and other illegal activities</Box>
      </Box>

      <Space h="md" />

      <Title order={2}>3. Sharing of Information</Title>
      <Text>We may share your information with:</Text>
      <Box component="ul">
        <Box component="li">
          <strong>Service Providers:</strong> Companies that perform services on our behalf (payment processing, 
          customer service, email delivery)
        </Box>
        <Box component="li">
          <strong>Business Partners:</strong> Third parties with whom we partner to offer products or services
        </Box>
        <Box component="li">
          <strong>Legal Requirements:</strong> When required by law or to protect our rights
        </Box>
      </Box>

      <Space h="md" />

      <Title order={2}>4. Data Retention</Title>
      <Text>
        We retain your personal information for as long as necessary to provide the services you have requested, 
        or for other essential purposes such as complying with our legal obligations, resolving disputes, and 
        enforcing our policies.
      </Text>

      <Space h="md" />

      <Title order={2}>5. International Transfers</Title>
      <Text>
        Your information may be transferred to — and maintained on — computers located outside of your state, 
        province, country, or other governmental jurisdiction where the data protection laws may differ.
      </Text>

      <Space h="md" />

      <Title order={2}>6. Your Rights</Title>
      <Text>Depending on your location, you may have rights to:</Text>
      <Box component="ul">
        <Box component="li">Access the personal information we hold about you</Box>
        <Box component="li">Correct inaccurate personal information</Box>
        <Box component="li">Delete your personal information</Box>
        <Box component="li">Object to the processing of your personal information</Box>
        <Box component="li">Export your personal information</Box>
      </Box>

      <Space h="md" />

      <Title order={2}>7. Cookies</Title>
      <Text>
        We use cookies and similar tracking technologies to track activity on our platform and hold certain 
        information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
      </Text>

      <Space h="md" />

      <Title order={2}>8. Children's Privacy</Title>
      <Text>
        Our platform is not intended for children under 16 years of age. We do not knowingly collect personal 
        information from children under 16.
      </Text>

      <Space h="md" />

      <Title order={2}>9. Changes to This Privacy Policy</Title>
      <Text>
        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
        Privacy Policy on this page and updating the "Last updated" date.
      </Text>

      <Space h="md" />

      <Title order={2}>10. Contact Us</Title>
      <Text>
        If you have any questions about this Privacy Policy, please contact us at:
      </Text>
      <Text>Email: privacy@artify-app.com</Text>
      <Text>Address: [Your Business Address]</Text>
    </Container>
  );
};

export default Privacy;
