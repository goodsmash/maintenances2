export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FormData {
  category: string;
  subcategory: string;
  serviceType: 'emergency' | 'scheduled' | '';
  name: string;
  email: string;
  phone: string;
  address: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  businessName?: string;
  businessType?: string;
  description: string;
  preferredDate?: string;
  preferredTime?: string;
}

export function validateForm(data: FormData): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!data.category) {
    errors.push({ field: 'category', message: 'Category is required' });
  }
  if (!data.subcategory) {
    errors.push({ field: 'subcategory', message: 'Subcategory is required' });
  }
  if (!data.serviceType) {
    errors.push({ field: 'serviceType', message: 'Service type is required' });
  }
  if (!data.name.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim() || !emailRegex.test(data.email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  // Phone validation
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!data.phone.trim() || !phoneRegex.test(data.phone)) {
    errors.push({ field: 'phone', message: 'Valid phone number is required' });
  }

  // Address validation
  if (!data.address.address.trim()) {
    errors.push({ field: 'address', message: 'Street address is required' });
  }
  if (!data.address.city.trim()) {
    errors.push({ field: 'city', message: 'City is required' });
  }
  if (!data.address.state.trim()) {
    errors.push({ field: 'state', message: 'State is required' });
  }
  if (!data.address.zipCode.trim()) {
    errors.push({ field: 'zipCode', message: 'ZIP code is required' });
  }

  // Description validation
  if (!data.description.trim()) {
    errors.push({ field: 'description', message: 'Issue description is required' });
  }

  // Scheduled service validation
  if (data.serviceType === 'scheduled') {
    if (!data.preferredDate) {
      errors.push({ field: 'preferredDate', message: 'Preferred date is required for scheduled service' });
    }
    if (!data.preferredTime) {
      errors.push({ field: 'preferredTime', message: 'Preferred time is required for scheduled service' });
    }
    
    // Validate that preferred date is in the future
    if (data.preferredDate) {
      const selectedDate = new Date(data.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.push({ field: 'preferredDate', message: 'Preferred date must be in the future' });
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
}

export function formatZipCode(zipCode: string): string {
  const cleaned = zipCode.replace(/\D/g, '');
  return cleaned.slice(0, 5);
}

export function validateZipCode(zipCode: string): boolean {
  const zipRegex = /^\d{5}$/;
  return zipRegex.test(zipCode);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone);
}
