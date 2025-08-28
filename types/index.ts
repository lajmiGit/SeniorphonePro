// Types communs pour l'application SeniorPhonePro

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  photo: string | undefined;
  isFavorite: boolean;
}

export interface SystemInfoProps {
  networkLevel?: number;
  batteryLevel?: number;
}

export interface PhoneDisplayProps {
  phoneNumber: string;
  onDeleteDigit: () => void;
  onCall?: (phoneNumber: string) => void;
}

export interface DialPadProps {
  onNumberPress: (num: string) => void;
}

export interface ContactListProps {
  onContactSelect: (contact: Contact) => void;
  onCreateContact: () => void;
  onHomePress: () => void;
}

export interface CallScreenProps {
  contact: Contact;
  onHomePress: () => void;
  onCall: (contact: Contact) => void;
  onCancel: () => void;
}

export interface CreateContactScreenProps {
  onHomePress: () => void;
  onContactCreated: () => void;
}

export interface NavigationScreenProps {
  onNavigateToContacts: () => void;
  onNavigateToCreateContact: () => void;
  onNavigateToPhone: () => void;
}

export interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onValidate: () => void;
  onClose: () => void;
  currentText: string;
}
