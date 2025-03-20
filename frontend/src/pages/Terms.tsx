import { Container, Title, Text, Space, Divider } from "@mantine/core";

const Terms = () => {
  return (
    <Container size="md" py="xl">
      <Title order={1}>Terms and Conditions</Title>
      <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
      <Space h="md" />

      <Text>
        Please read these Terms and Conditions ("Terms", "Terms and Conditions")
        carefully before using the Artify platform operated by Artify Inc.
        ("us", "we", or "our").
      </Text>

      <Space h="md" />
      <Divider />
      <Space h="md" />

      <Title order={2}>1. Acceptance of Terms</Title>
      <Text>
        By accessing or using the Service, you agree to be bound by these Terms.
        If you disagree with any part of the terms, then you may not access the
        Service.
      </Text>

      <Space h="md" />

      <Title order={2}>2. Subscriptions</Title>
      <Text>
        Some parts of the Service are billed on a subscription basis. You will
        be billed in advance on a recurring basis, depending on the type of
        subscription plan you select.
      </Text>

      <Space h="md" />

      <Title order={2}>3. Content</Title>
      <Text>
        Our Service allows you to post, link, store, share and otherwise make
        available certain information, text, graphics, videos, or other
        material. You are responsible for the content that you post to the
        Service, including its legality, reliability, and appropriateness.
      </Text>

      <Space h="md" />

      <Title order={2}>4. Accounts</Title>
      <Text>
        When you create an account with us, you must provide information that is
        accurate, complete, and current at all times. Failure to do so
        constitutes a breach of the Terms, which may result in immediate
        termination of your account on our Service.
      </Text>

      <Space h="md" />

      <Title order={2}>5. Intellectual Property</Title>
      <Text>
        The Service and its original content, features, and functionality are
        and will remain the exclusive property of Artify Inc. and its licensors.
        The Service is protected by copyright, trademark, and other laws.
      </Text>

      <Space h="md" />

      <Title order={2}>6. Links To Other Web Sites</Title>
      <Text>
        Our Service may contain links to third-party web sites or services that
        are not owned or controlled by Artify Inc. We have no control over, and
        assume no responsibility for, the content, privacy policies, or
        practices of any third-party web sites or services.
      </Text>

      <Space h="md" />

      <Title order={2}>7. Termination</Title>
      <Text>
        We may terminate or suspend your account immediately, without prior
        notice or liability, for any reason whatsoever, including without
        limitation if you breach the Terms.
      </Text>

      <Space h="md" />

      <Title order={2}>8. Limitation Of Liability</Title>
      <Text>
        In no event shall Artify Inc., nor its directors, employees, partners,
        agents, suppliers, or affiliates, be liable for any indirect,
        incidental, special, consequential or punitive damages, including
        without limitation, loss of profits, data, use, goodwill, or other
        intangible losses.
      </Text>

      <Space h="md" />

      <Title order={2}>9. Governing Law</Title>
      <Text>
        These Terms shall be governed and construed in accordance with the laws
        of [Your Country], without regard to its conflict of law provisions.
      </Text>

      <Space h="md" />

      <Title order={2}>10. Changes</Title>
      <Text>
        We reserve the right, at our sole discretion, to modify or replace these
        Terms at any time. If a revision is material we will try to provide at
        least 30 days' notice prior to any new terms taking effect.
      </Text>

      <Space h="md" />

      <Title order={2}>11. Contact Us</Title>
      <Text>
        If you have any questions about these Terms, please contact us at:
      </Text>
      <Text>Email: support@artify-app.com</Text>
      <Text>Address: [Your Business Address]</Text>
    </Container>
  );
};

export default Terms;
