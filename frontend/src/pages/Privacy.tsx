import { Box, Container, Title, Text, Space, Divider } from "@mantine/core";
import NavigationFooter from "../components/NavigationFooter";

const Privacy = () => {
  return (
    <Container size="md" py="xl">
      <Title order={1}>Privacy Policy</Title>
      <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
      <Space h="md" />

      <Text>
        This Privacy Policy describes how Artify Inc. ("we," "our," or "us")
        collects, uses, and discloses your personal information when you use our
        platform, "Artify," an AI-powered photo editing service available
        through our website.
      </Text>

      <Space h="md" />
      <Divider />
      <Space h="md" />

      <Title order={2}>1. Information We Collect</Title>
      <Text>
        <strong>Personal Information:</strong> When you create an account, we
        collect your name, email address, and any additional information you
        choose to provide. We also collect images you upload for editing
        purposes.
      </Text>
      <Text>
        <strong>Authentication Information:</strong> We use Firebase for
        authentication. Your authentication data (e.g., login credentials) is
        processed by Firebase. For details, see{" "}
        <Text
          component="a"
          href="https://firebase.google.com/support/privacy"
          target="_blank"
          rel="noopener noreferrer"
          c="blue"
        >
          Firebase's Privacy Policy.
        </Text>
      </Text>
      <Text>
        <strong>Payment Information:</strong> When you make a purchase, our
        third-party payment processor, Paddle, collects your payment details
        (e.g., credit card information). We do not store your full payment
        details on our servers. For more information on how Paddle handles your
        data, refer to{" "}
        <Text
          component="a"
          href="https://www.paddle.com/legal/privacy"
          target="_blank"
          rel="noopener noreferrer"
          c="blue"
        >
          Paddle’s Privacy Policy.
        </Text>
        <Text>
          <strong>Usage Information:</strong> We collect data about how you
          interact with Artify, including your IP address, browser type, device
          information, pages visited, and time spent on the platform. This helps
          us enhance your experience and improve our services.
        </Text>
        <Text>
          <strong>Cookies and Tracking Technology:</strong> We use cookies and
          similar technologies to remember your preferences, analyze usage
          patterns, and improve functionality. You can manage cookie settings
          through your browser.
        </Text>
      </Text>

      <Space h="md" />

      <Title order={2}>2. How We Use Your Information</Title>
      <Text>We use your information to:</Text>
      <Box component="ul">
        <Box component="li">
          To provide, maintain, and improve Artify’s features and services.
        </Box>
        <Box component="li">
          To process transactions and send related confirmations or updates.
        </Box>
        <Box component="li">
          To send administrative messages (e.g., account notifications),
          updates, and marketing communications (where permitted).
        </Box>
        <Box component="li">
          To respond to your comments, questions, or support requests.
        </Box>
        <Box component="li">
          To monitor and analyze trends, usage, and activities on the platform.
        </Box>
        <Box component="li">
          To detect, investigate, and prevent fraudulent transactions or illegal
          activities.
        </Box>
        <Box component="li">
          <strong>AI Features : </strong> We use your uploaded images solely to
          provide the editing services you request. We may also use anonymized,
          aggregated data to enhance our AI models and features.
        </Box>
      </Box>

      <Space h="md" />

      <Title order={2}>3. Sharing of Information</Title>
      <Text>We may share your information with:</Text>
      <Box component="ul">
        <Box component="li">
          <strong>Service Providers:</strong> Companies that assist us with
          services like payment processing (e.g., Paddle), customer support, and
          email delivery.
        </Box>
        <Box component="li">
          <strong>AI Service Providers:</strong> We may share your uploaded
          images with third-party AI providers to process your requested edits.
          These providers are bound by confidentiality agreements and may only
          use your data to fulfill our service requests.
        </Box>
        <Box component="li">
          <strong>Business Partners:</strong> Third parties we collaborate with
          to offer products or services, where applicable.
        </Box>
        <Box component="li">
          <strong>Legal Requirements:</strong> Authorities or entities when
          required by law, or to protect our rights, safety, or property.
        </Box>
      </Box>

      <Space h="md" />

      <Title order={2}>4. Data Retention</Title>
      <Text>
        We retain your personal information for as long as necessary to provide
        the services you have requested, or for other essential purposes such as
        complying with our legal obligations, resolving disputes, and enforcing
        our policies.
      </Text>
      <Box component="ul">
        <Box component="li">Provide the services you’ve requested.</Box>
        <Box component="li">
          Fulfill legal obligations, resolve disputes, or enforce our policies.
        </Box>
      </Box>

      <Text>
        Specifically, user-uploaded images are kept only as long as needed to
        deliver the editing services. You can delete your images at any time via
        your account settings.
      </Text>

      <Space h="md" />

      <Title order={2}>5. International Transfers</Title>
      <Text>
        Your information, including personal data, may be transferred to and
        stored on servers in the United States or other countries where our
        service providers operate. These locations may have different data
        protection laws than your jurisdiction. By using Artify, you consent to
        this transfer.
      </Text>

      <Space h="md" />

      <Title order={2}>6. Your Rights</Title>
      <Text>Depending on your location, you may have rights to:</Text>
      <Box component="ul">
        <Box component="li">
          <strong>Access : </strong> Request a copy of the data we hold about
          you.
        </Box>
        <Box component="li">
          <strong>Correction:</strong> Update or correct inaccurate information.
        </Box>
        <Box component="li">
          <strong>Deletion:</strong> Request the removal of your personal data.
        </Box>
        <Box component="li">
          <strong>Objection:</strong> Object to certain types of data
          processing.
        </Box>
        <Box component="li">
          <strong>Export:</strong> Receive your data in a portable format.
        </Box>
      </Box>

      <Text>
        To exercise these rights, contact us at privacy@artify-app.com
        (mailto:privacy@artify-app.com). We will respond in accordance with
        applicable data protection laws.
      </Text>

      <Space h="md" />

      <Title order={2}>7. Cookies</Title>
      <Text>
        We use cookies and similar technologies to enhance your experience.
        Types of cookies include:
      </Text>

      <Box component="ul">
        <Box component="li">
          <strong>Essential Cookies:</strong> Required for core functionality,
          like authentication.
        </Box>
        <Box component="li">
          <strong>Analystics Cookies:</strong> Help us analyze how users
          interact with Artify to improve it.
        </Box>
        <Box component="li">
          <strong>Preference Cookies:</strong> Store your settings and
          preferences.
        </Box>
      </Box>

      <Text>
        You can refuse cookies or manage preferences through your browser
        settings or by contacting us.
      </Text>

      <Space h="md" />

      <Title order={2}>8. Children's Privacy</Title>
      <Text>
        Artify is not intended for children under 16 years of age. We do not
        knowingly collect personal information from children under 16. If we
        learn such data has been collected, we will delete it promptly.
      </Text>

      <Space h="md" />

      <Title order={2}>9. Changes to This Privacy Policy</Title>
      <Text>
        We may update this Privacy Policy periodically. Changes will be posted
        on this page with an updated "Last updated" date. We encourage you to
        review this policy regularly.
      </Text>

      <Space h="md" />

      <Title order={2}>10. Contact Us</Title>
      <Text>
        If you have any questions about this Privacy Policy, please contact us
        at:
      </Text>
      <Text>Email: haeriz42069@gmail.com</Text>

      <Space h="md" />

      <Title order={2}>11. Data Security</Title>
      <Text>
        We use industry-standard security measures—like encryption, secure
        servers, and regular audits—to protect your personal information from
        unauthorized access, use, or disclosure. However, no online transmission
        or storage method is 100% secure, so we cannot guarantee absolute
        security.
      </Text>
      <Space h="md" />

      <Title order={2}>12. Sharing and Collaboration</Title>
      <Text>
        If Artify includes features allowing you to share projects or
        collaborate with others, those users will have access to the images and
        edits within shared projects. You are responsible for ensuring you have
        the right to share any content you upload.
      </Text>
      <Space h="md" />

      <Title order={2}>13. Compliance with Laws</Title>
      <Text>
        We are committed to complying with applicable data protection laws,
        including the General Data Protection Regulation (GDPR) and the
        California Consumer Privacy Act (CCPA). For questions about your rights
        under these laws, contact us at privacy@artify-app.com
        (mailto:privacy@artify-app.com).
      </Text>
      
      <Space h="xl" />
      <NavigationFooter />
    </Container>
  );
};

export default Privacy;
