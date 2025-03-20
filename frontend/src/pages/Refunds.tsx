import { Box, Container, Title, Text, Space, Divider } from '@mantine/core';

const Refunds = () => {
  return (
    <Container size="md" py="xl">
      <Title order={1}>Refund Policy</Title>
      <Text c="dimmed">Last updated: {new Date().toLocaleDateString()}</Text>
      <Space h="md" />
      
      <Text>
        This Refund Policy outlines our guidelines for refunds and cancellations for services purchased through 
        the Artify platform.
      </Text>

      <Space h="md" />
      <Divider />
      <Space h="md" />

      <Title order={2}>1. Digital Product Purchases</Title>
      <Text>
        Due to the nature of digital products and services, we generally do not offer refunds on completed purchases. 
        However, we may consider refunds in the following circumstances:
      </Text>
      <Box component="ul">
        <Box component="li">Technical issues that prevent access to the purchased content</Box>
        <Box component="li">Duplicate charges or billing errors</Box>
        <Box component="li">Significant discrepancies between the advertised product and what was delivered</Box>
      </Box>

      <Space h="md" />

      <Title order={2}>2. Subscription Services</Title>
      <Text>
        <strong>Cancellations:</strong> You may cancel your subscription at any time through your account settings or by 
        contacting our customer support. Upon cancellation, you will continue to have access to the service until the 
        end of your current billing period.
      </Text>
      <Text>
        <strong>Refunds:</strong> For monthly subscriptions, we do not provide partial refunds for unused portions of 
        the month. For annual subscriptions, we may provide a prorated refund for the unused portion at our discretion.
      </Text>

      <Space h="md" />

      <Title order={2}>3. Trial Periods</Title>
      <Text>
        If you cancel your subscription during a free trial period, no charges will be applied. If you cancel after 
        the trial period has ended and you have been charged, our standard subscription refund policy applies.
      </Text>

      <Space h="md" />

      <Title order={2}>4. Request Process</Title>
      <Text>
        To request a refund, please contact us at support@artify-app.com with the following information:
      </Text>
      <Box component="ul">
        <Box component="li">Your full name and email address associated with your account</Box>
        <Box component="li">Date of purchase</Box>
        <Box component="li">Order/transaction ID</Box>
        <Box component="li">Reason for refund request</Box>
      </Box>
      <Text>
        We aim to respond to all refund requests within 5 business days.
      </Text>

      <Space h="md" />

      <Title order={2}>5. Payment Processing</Title>
      <Text>
        All refunds will be issued to the original payment method used for the purchase. Depending on your payment 
        provider, it may take 5-10 business days for the refund to appear in your account.
      </Text>

      <Space h="md" />

      <Title order={2}>6. International Transactions</Title>
      <Text>
        For international purchases, refunds will be processed in the same currency as the original transaction. 
        Please note that due to fluctuations in exchange rates, the refunded amount in your local currency may 
        differ from the original charge.
      </Text>

      <Space h="md" />

      <Title order={2}>7. Exceptions</Title>
      <Text>
        We reserve the right to make exceptions to this policy at our sole discretion. If we make an exception 
        for you, this does not mean we will make the same exception in the future.
      </Text>

      <Space h="md" />

      <Title order={2}>8. Changes to This Policy</Title>
      <Text>
        We may update our Refund Policy from time to time. We will notify you of any changes by posting the new 
        Refund Policy on this page and updating the "Last updated" date.
      </Text>

      <Space h="md" />

      <Title order={2}>9. Contact Us</Title>
      <Text>
        If you have any questions about this Refund Policy, please contact us at:
      </Text>
      <Text>Email: support@artify-app.com</Text>
      <Text>Address: [Your Business Address]</Text>
    </Container>
  );
};

export default Refunds;
