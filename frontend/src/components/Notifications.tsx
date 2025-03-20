import { Alert } from "@mantine/core";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimesCircle,
} from "react-icons/fa";

interface NotificationProps {
  title?: string;
  message: string;
  onClose?: () => void;
}

export const SuccessNotification = ({
  title = "Success",
  message,
  onClose,
}: NotificationProps) => {
  return (
    <Alert
      variant="light"
      color="green"
      withCloseButton={!!onClose}
      onClose={onClose}
      title={title}
      icon={<FaCheckCircle size={18} />}
      mb="md"
    >
      {message}
    </Alert>
  );
};

export const ErrorNotification = ({
  title = "Error",
  message,
  onClose,
}: NotificationProps) => {
  return (
    <Alert
      variant="light"
      color="red"
      withCloseButton={!!onClose}
      onClose={onClose}
      title={title}
      icon={<FaTimesCircle size={18} />}
      mb="md"
    >
      {message}
    </Alert>
  );
};

export const WarningNotification = ({
  title = "Warning",
  message,
  onClose,
}: NotificationProps) => {
  return (
    <Alert
      variant="light"
      color="yellow"
      withCloseButton={!!onClose}
      onClose={onClose}
      title={title}
      icon={<FaExclamationTriangle size={18} />}
      mb="md"
    >
      {message}
    </Alert>
  );
};

export const InfoNotification = ({
  title = "Information",
  message,
  onClose,
}: NotificationProps) => {
  return (
    <Alert
      variant="light"
      color="blue"
      withCloseButton={!!onClose}
      onClose={onClose}
      title={title}
      icon={<FaInfoCircle size={18} />}
      mb="md"
    >
      {message}
    </Alert>
  );
};

// Specific notification examples
export const AccountCreatedNotification = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  return (
    <SuccessNotification
      title="Account Created"
      message="Your account has been successfully created. You can now log in."
      onClose={onClose}
    />
  );
};

export const LoginSuccessNotification = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  return (
    <SuccessNotification
      title="Login Successful"
      message="You have been successfully logged in."
      onClose={onClose}
    />
  );
};

export const WeakPasswordNotification = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  return (
    <WarningNotification
      title="Weak Password"
      message="Your password is too weak. Please use at least 8 characters with a mix of letters, numbers, and special characters."
      onClose={onClose}
    />
  );
};

export const PasswordMismatchNotification = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  return (
    <ErrorNotification
      title="Password Mismatch"
      message="The passwords you entered do not match. Please try again."
      onClose={onClose}
    />
  );
};

export const EmailInUseNotification = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  return (
    <ErrorNotification
      title="Email Already in Use"
      message="This email address is already registered. Please use a different email or try to log in."
      onClose={onClose}
    />
  );
};

export const InvalidCredentialsNotification = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  return (
    <ErrorNotification
      title="Invalid Credentials"
      message="The email or password you entered is incorrect. Please try again."
      onClose={onClose}
    />
  );
};
