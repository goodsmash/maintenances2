import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { DetailedCategorySelector } from './DetailedCategorySelector';
import { SmartAddressInput } from './SmartAddressInput';
import { SmartIssueDescription } from './SmartIssueDescription';
import { SmartBusinessTypeSelector } from './SmartBusinessTypeSelector';
import { validateForm, formatPhoneNumber, formatZipCode, ValidationError } from '../utils/validation';
import { getAddressSuggestions } from '../utils/api';
import { issueSuggestions } from '../data/issueSuggestions';
import { 
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  AlertTriangle,
  Building2,
  ClipboardList,
  AlertCircle
} from "lucide-react";
import { toast } from "./ui/use-toast";

interface FormData {
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
  additionalNotes?: string;
}

const initialFormData: FormData = {
  category: '',
  subcategory: '',
  serviceType: '',
  name: '',
  email: '',
  phone: '',
  address: {
    address: '',
    city: '',
    state: '',
    zipCode: ''
  },
  description: ''
};

export function MultiStepServiceForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCategorySelect = (category: string, subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      category,
      subcategory
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format phone numbers and zip codes as they're typed
    if (name === 'phone') {
      formattedValue = formatPhoneNumber(value);
    } else if (name === 'address.zipCode') {
      formattedValue = formatZipCode(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));
  };

  const validateStep = (currentStep: number): boolean => {
    const result = validateForm(formData);
    setErrors(result.errors);

    // Filter errors relevant to the current step
    const stepErrors = result.errors.filter(error => {
      switch (currentStep) {
        case 1:
          return ['category', 'subcategory'].includes(error.field);
        case 2:
          return ['serviceType'].includes(error.field);
        case 3:
          return ['name', 'email', 'phone', 'address', 'description'].includes(error.field);
        default:
          return false;
      }
    });

    return stepErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    } else {
      toast({
        title: "Please fix the errors before continuing",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = validateForm(formData);
    if (!result.isValid) {
      setErrors(result.errors);
      toast({
        title: "Please fix the form errors",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // TODO: Implement form submission to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast({
        title: "Service request submitted successfully!",
        description: "We'll contact you shortly to confirm the details.",
      });
      
      // Reset form
      setFormData(initialFormData);
      setStep(1);
    } catch (error) {
      toast({
        title: "Error submitting request",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Select Service Category</h2>
            <DetailedCategorySelector
              onCategorySelect={handleCategorySelect}
              selectedCategory={formData.category}
              selectedSubcategory={formData.subcategory}
            />
            {formData.subcategory && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleNext}>Continue</Button>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Service Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  formData.serviceType === 'emergency' ? 'ring-2 ring-red-500' : ''
                }`}
                onClick={() => setFormData(prev => ({ ...prev, serviceType: 'emergency' }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-red-500">
                    <AlertTriangle className="h-5 w-5" />
                    <h3 className="font-medium">Emergency Service</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Immediate response required</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  formData.serviceType === 'scheduled' ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setFormData(prev => ({ ...prev, serviceType: 'scheduled' }))}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 text-primary">
                    <Calendar className="h-5 w-5" />
                    <h3 className="font-medium">Schedule Service</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Book for a specific date/time</p>
                </CardContent>
              </Card>
            </div>
            {formData.serviceType && (
              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleNext}>Continue</Button>
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <div className="relative">
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                  <Building2 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <div className="relative">
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                  />
                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <SmartAddressInput
                  value={formData.address}
                  onChange={(address) => setFormData(prev => ({
                    ...prev,
                    address
                  }))}
                  className="w-full"
                />
              </div>

              {formData.category === 'commercial' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Name</label>
                    <Input
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Business Type</label>
                    <SmartBusinessTypeSelector
                      value={formData.businessType}
                      onChange={(value) => setFormData(prev => ({
                        ...prev,
                        businessType: value
                      }))}
                    />
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description of Issue</label>
              <SmartIssueDescription
                value={formData.description}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  description: value
                }))}
                category={formData.category}
                subcategory={formData.subcategory}
                className="w-full"
              />
            </div>

            {formData.serviceType === 'scheduled' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Date</label>
                  <Input
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Time</label>
                  <Input
                    type="time"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={handleSubmit}>Submit Request</Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              1
            </div>
            <div className="h-1 w-16 bg-gray-200">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: step >= 2 ? '100%' : '0%' }}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              2
            </div>
            <div className="h-1 w-16 bg-gray-200">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: step >= 3 ? '100%' : '0%' }}
              />
            </div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'
              }`}
            >
              3
            </div>
          </div>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-center space-x-2 text-red-600 mb-2">
            <AlertCircle className="h-5 w-5" />
            <h4 className="font-medium">Please fix the following errors:</h4>
          </div>
          <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
            {errors.map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      {renderStep()}
    </div>
  );
}
