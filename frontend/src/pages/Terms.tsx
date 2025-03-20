import { Container, Title, Text, Space, Divider } from "@mantine/core";
import NavigationFooter from "../components/NavigationFooter";

const Terms = () => {
  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Title order={1}>Terms and Conditions</Title>
      <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
      <Space h="md" />

      <Text fw={700}>
        IMPORTANT: Artify is owned and operated by Hariz Faizul (sole proprietor), 
        registered business owner. These Terms constitute a legally binding agreement 
        between you and Hariz Faizul operating as "Artify."
      </Text>

      <Space h="md" />
      
      <Text>
        Please read these Terms and Conditions ("Terms") carefully before using
        the Artify platform ("Service") operated by Hariz Faizul ("us", "we", or
        "our"). Your access to and use of the Service is conditioned on your
        acceptance of and compliance with these Terms. These Terms apply to all
        visitors, users, and others who access or use the Service.
      </Text>

      <Space h="md" />
      <Divider />
      <Space h="md" />

      {/* Section 1: Acceptance of Terms */}
      <Title order={2}>1. Acceptance of Terms</Title>
      <Text>
        By accessing or using the Service, you agree to be bound by these Terms
        and all applicable laws and regulations. If you do not agree with any
        part of these Terms, you must not access or use the Service.
      </Text>

      <Space h="md" />

      {/* Section 2: Subscriptions */}
      <Title order={2}>2. Subscriptions and Payments</Title>
      <Text>
        Some parts of the Service are available only through paid subscriptions.
        You will be billed in advance on a recurring basis (monthly or annually,
        depending on the subscription plan you select). You authorize Hariz Faizul (Artify)
        to charge your chosen payment method automatically at the start of
        each billing period via our payment processor, Paddle. Subscription fees are non-refundable except as
        outlined in our Refund Policy.
      </Text>
      <Text>
        We reserve the right to modify subscription fees or introduce new fees
        at any time. We will provide at least 30 days' notice of any price
        changes. Your continued use of the Service after such changes
        constitutes your acceptance of the new fees.
      </Text>

      <Space h="md" />

      {/* Service Description Section - ADDED */}
      <Title order={2}>3. Service Description</Title>
      <Text>
        Artify is an AI-powered photo editing platform that uses Google Gemini API and other 
        artificial intelligence technologies to provide image enhancement, style transfer, 
        editing, and generation services. Our platform allows users to:
      </Text>
      <ul>
        <li>Edit photos with AI-powered tools</li>
        <li>Generate new images based on text prompts</li>
        <li>Transform images with various artistic styles</li>
        <li>Access templates and presets for quick editing</li>
        <li>Store and organize edited images in the cloud</li>
      </ul>
      <Text>
        The availability of features depends on your subscription plan as detailed on our Pricing page.
      </Text>

      <Space h="md" />

      {/* Section 3: Content */}
      <Title order={2}>4. User Content</Title>
      <Text>
        Our Service allows you to upload, store, edit, share, and otherwise make
        available certain information, text, graphics, images, or other material
        ("User Content"). You retain ownership of your User Content, but by
        uploading it, you grant Hariz Faizul (Artify) a worldwide, non-exclusive,
        royalty-free license to use, reproduce, modify, and display your User
        Content solely for the purpose of providing and improving the Service.
      </Text>
      <Text>
        You are solely responsible for the legality, reliability, and
        appropriateness of your User Content. Artify reserves the right to
        remove any User Content that violates these Terms or is deemed
        objectionable.
      </Text>

      <Space h="md" />

      {/* Section 4: Accounts */}
      <Title order={2}>5. User Accounts</Title>
      <Text>
        When you create an account with us, you must provide information that is
        accurate, complete, and current at all times. You are responsible for
        safeguarding your account credentials and for any activities or actions
        under your account. Failure to maintain accurate information or secure
        your account may result in immediate suspension or termination of your
        account at our discretion.
      </Text>

      <Space h="md" />

      {/* Section 5: Intellectual Property */}
      <Title order={2}>6. Intellectual Property</Title>
      <Text>
        The Service and its original content, features, functionality, and
        design are and will remain the exclusive property of Artify Inc. and its
        licensors. The Service is protected by copyright, trademark, patent, and
        other intellectual property laws of [Your Country] and international
        jurisdictions. You agree not to reproduce, distribute, modify, or create
        derivative works of the Service without our prior written consent.
      </Text>

      <Space h="md" />

      {/* Section 6: Links To Other Web Sites */}
      <Title order={2}>7. Third-Party Links and Services</Title>
      <Text>
        Our Service may contain links to third-party websites or services (e.g.,
        payment processors) that are not owned or controlled by Artify Inc. We
        have no control over, and assume no responsibility for, the content,
        privacy policies, or practices of any third-party websites or services.
        You access them at your own risk.
      </Text>

      <Space h="md" />

      {/* Section 7: Termination */}
      <Title order={2}>8. Termination</Title>
      <Text>
        We may terminate or suspend your account and access to the Service
        immediately, without prior notice or liability, for any reason,
        including if you breach these Terms. Upon termination, your right to use
        the Service will cease, and we may delete your User Content. You may
        terminate your account at any time by contacting us at
        **support@artify-app.com**.
      </Text>

      <Space h="md" />

      {/* Section 8: Limitation Of Liability */}
      <Title order={2}>9. Limitation of Liability</Title>
      <Text>
        To the fullest extent permitted by law, Artify Inc., its directors,
        employees, partners, agents, suppliers, or affiliates shall not be
        liable for any indirect, incidental, special, consequential, or punitive
        damages, including without limitation loss of profits, data, use,
        goodwill, or other intangible losses, resulting from your use of or
        inability to use the Service.
      </Text>
      <Text>
        The Service is provided "as is" and "as available," without warranties
        of any kind, express or implied, including but not limited to warranties
        of merchantability, fitness for a particular purpose, or
        non-infringement.
      </Text>

      <Space h="md" />

      {/* Section 9: Governing Law */}
      <Title order={2}>10. Governing Law</Title>
      <Text>
        These Terms shall be governed and construed in accordance with the laws
        of [Your Country], without regard to its conflict of law provisions. Any
        disputes arising from these Terms or the Service shall be resolved in
        the courts of [Your Country].
      </Text>

      <Space h="md" />

      {/* Section 10: Changes */}
      <Title order={2}>11. Changes to Terms</Title>
      <Text>
        We reserve the right, at our sole discretion, to modify or replace these
        Terms at any time. If a revision is material, we will provide at least
        30 days' notice prior to the new terms taking effect by posting the
        updated Terms on the Service. Your continued use of the Service after
        such changes constitutes your acceptance of the new Terms.
      </Text>

      <Space h="md" />

      {/* Section 11: Contact Us */}
      <Title order={2}>12. Contact Us</Title>
      <Text>
        If you have any questions about these Terms, please contact us at:
      </Text>
      <Text>Business Name: Artify (owned by Hariz Faizul)</Text>
      <Text>Email: haeriz42069@gmail.com</Text>
      <Text>Address: 123 Main Street, Jakarta, Indonesia 12345</Text>
      <Text>Phone: +62 812-3456-7890</Text>

      <Space h="xl" />
      <NavigationFooter />
    </Container>
  );
};

export default Terms;
