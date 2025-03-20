import { Box, Container, Title, Text, Space, Divider } from "@mantine/core";

const Refunds = () => {
  return (
    <Container size="md" py="xl">
      {/* Header */}
      <Title order={1}>Refund Policy</Title>
      <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
      <Space h="md" />

      <Text>
        This Refund Policy outlines the guidelines for refunds and cancellations
        for services purchased through the Artify platform, an AI-powered photo
        editing service provided by Artify Inc.
      </Text>

      <Space h="md" />
      <Divider />
      <Space h="md" />

      {/* Section 1: Digital Product Purchases */}
      <Title order={2}>1. Digital Product Purchases</Title>
      <Text>
        Due to the immediate delivery nature of digital products, such as
        AI-edited images, we generally do not offer refunds on completed
        purchases unless exceptional circumstances apply. Eligible cases
        include:
      </Text>
      <Box component="ul">
        <Box component="li">
          Persistent technical issues preventing access to your edited images or
          platform features.
        </Box>
        <Box component="li">
          Duplicate charges or billing errors processed through Paddle.
        </Box>
        <Box component="li">
          Significant failure of the AI to deliver results as advertised (e.g.,
          no edit applied).
        </Box>
      </Box>

      <Space h="md" />

      {/* Section 2: Subscription Services */}
      <Title order={2}>2. Subscription Services</Title>
      <Text>
        <strong>Cancellations:</strong> You may cancel your subscription at any
        time via your account settings or by contacting us at
        support@artify-app.com. After cancellation, you retain access to Artify
        until the end of your current billing cycle.
      </Text>
      <Text>
        <strong>Refunds:</strong>
        <Box component="ul">
          <Box component="li">
            Monthly subscriptions are non-refundable for unused portions of the
            billing period.
          </Box>
          <Box component="li">
            For annual subscriptions, we may issue a prorated refund for the
            remaining unused months, calculated from the cancellation date, at
            our discretion.
          </Box>
        </Box>
      </Text>

      <Space h="md" />

      {/* Section 3: Trial Periods */}
      <Title order={2}>3. Trial Periods</Title>
      <Text>
        Artify may offer free trial periods for subscription plans. If you
        cancel during the trial, no charges will be applied. If you continue
        past the trial and are charged, our standard subscription refund policy
        applies.
      </Text>

      <Space h="md" />

      {/* Section 4: Request Process */}
      <Title order={2}>4. Request Process</Title>
      <Text>
        To request a refund, please email us at support@artify-app.com with the
        following details:
      </Text>
      <Box component="ul">
        <Box component="li">
          Your full name and email address linked to your Artify account.
        </Box>
        <Box component="li">Date of the purchase or subscription charge.</Box>
        <Box component="li">
          Paddle transaction ID (found in your payment confirmation email).
        </Box>
        <Box component="li">Detailed reason for your refund request.</Box>
      </Box>
      <Text>
        We will review your request and respond within 5 business days.
      </Text>

      <Space h="md" />

      {/* Section 5: Payment Processing */}
      <Title order={2}>5. Payment Processing</Title>
      <Text>
        Refunds, when approved, will be issued to the original payment method
        via Paddle. Processing times may vary, typically taking 5-10 business
        days to reflect in your account, depending on your bank or card issuer.
      </Text>

      <Space h="md" />

      {/* Section 6: International Transactions */}
      <Title order={2}>6. International Transactions</Title>
      <Text>
        For purchases made outside the United States, refunds will be processed
        in the original transaction currency. Note that exchange rate
        fluctuations may result in a refunded amount differing from the initial
        charge in your local currency.
      </Text>

      <Space h="md" />

      {/* Section 7: Non-Refundable Cases */}
      <Title order={2}>7. Non-Refundable Cases</Title>
      <Text>Refunds will not be provided for:</Text>
      <Box component="ul">
        <Box component="li">
          Dissatisfaction with AI-generated results that meet basic
          functionality.
        </Box>
        <Box component="li">Changes of mind after using the service.</Box>
        <Box component="li">
          Failure to cancel a subscription before renewal.
        </Box>
      </Box>

      <Space h="md" />

      {/* Section 8: Exceptions */}
      <Title order={2}>8. Exceptions</Title>
      <Text>
        Artify reserves the right to grant exceptions to this policy at our sole
        discretion. An exception made for one case does not guarantee similar
        exceptions in the future.
      </Text>

      <Space h="md" />

      {/* Section 9: Changes to This Policy */}
      <Title order={2}>9. Changes to This Policy</Title>
      <Text>
        We may update this Refund Policy as needed. Changes will be posted on
        this page with an updated "Last updated" date. We recommend reviewing
        this policy periodically.
      </Text>

      <Space h="md" />

      {/* Section 10: Contact Us */}
      <Title order={2}>10. Contact Us</Title>
      <Text>
        For questions or assistance with this Refund Policy, please reach out
        to:
      </Text>
      <Text>Email: haeriz42069@gmail.com</Text>
    </Container>
  );
};

export default Refunds;
