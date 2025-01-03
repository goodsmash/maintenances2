/**
 * Appointments Data Module
 * 
 * Defines the data structure and operations for managing maintenance service appointments.
 * Uses Zod for runtime type validation and TypeScript type inference.
 */

import { z } from 'zod';

/**
 * Appointment Schema Definition
 * Validates the structure of appointment data using Zod
 */
export const appointmentSchema = z.object({
  /** Unique identifier for the appointment */
  id: z.string(),
  /** Type of service being scheduled */
  serviceType: z.string(),
  /** Specific service identifier */
  serviceId: z.string(),
  /** Customer's unique identifier */
  customerId: z.string(),
  /** Customer's full name */
  customerName: z.string(),
  /** Customer's email address */
  customerEmail: z.string(),
  /** Customer's contact number */
  customerPhone: z.string(),
  /** Service location address */
  address: z.string(),
  /** Appointment date in ISO format */
  date: z.string(),
  /** Appointment time slot */
  time: z.string(),
  /** Current status of the appointment */
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  /** Optional additional notes */
  notes: z.string().optional(),
  /** Service urgency level */
  urgencyLevel: z.string(),
  /** Estimated duration of the service */
  estimatedDuration: z.string(),
  /** Service price */
  price: z.number(),
  /** Assigned technician details */
  technician: z.object({
    id: z.string(),
    name: z.string(),
    qualifications: z.array(z.string()),
    rating: z.number().optional(),
  }).optional(),
  /** Appointment creation timestamp */
  createdAt: z.string(),
  /** Last update timestamp */
  updatedAt: z.string()
});

/** Type definition for Appointment, inferred from the schema */
export type Appointment = z.infer<typeof appointmentSchema>;

/** Available time slots for appointments */
export const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30'
];

// Mock appointments data for testing
export const mockAppointments: Appointment[] = [
  {
    id: "apt1",
    serviceType: "plumbing",
    serviceId: "leak_repair",
    customerId: "cust1",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    customerPhone: "555-0123",
    address: "123 Main St, City, ST 12345",
    date: "2025-01-05",
    time: "09:00",
    status: "confirmed",
    urgencyLevel: "priority",
    estimatedDuration: "2 hours",
    price: 250,
    technician: {
      id: "tech1",
      name: "Mike Smith",
      qualifications: ["Licensed Plumber", "Leak Detection Certification"],
      rating: 4.8
    },
    notes: "Water leak under kitchen sink",
    createdAt: "2025-01-02T01:00:00Z",
    updatedAt: "2025-01-02T01:00:00Z"
  },
  {
    id: "apt2",
    serviceType: "hvac",
    serviceId: "ac_repair",
    customerId: "cust2",
    customerName: "Jane Smith",
    customerEmail: "jane@example.com",
    customerPhone: "555-0124",
    address: "456 Oak St, City, ST 12345",
    date: "2025-01-06",
    time: "13:30",
    status: "pending",
    urgencyLevel: "routine",
    estimatedDuration: "3 hours",
    price: 350,
    technician: {
      id: "tech2",
      name: "Bob Johnson",
      qualifications: ["HVAC Certified", "EPA 608 Certification"],
      rating: 4.9
    },
    notes: "AC not cooling properly",
    createdAt: "2025-01-02T02:00:00Z",
    updatedAt: "2025-01-02T02:00:00Z"
  },
  {
    id: "apt3",
    serviceType: "pest_control",
    serviceId: "pest_inspection",
    customerId: "cust3",
    customerName: "Alice Brown",
    customerEmail: "alice@example.com",
    customerPhone: "555-0125",
    address: "789 Pine St, City, ST 12345",
    date: "2025-01-07",
    time: "10:00",
    status: "confirmed",
    urgencyLevel: "urgent",
    estimatedDuration: "1.5 hours",
    price: 200,
    technician: {
      id: "tech3",
      name: "Sarah Wilson",
      qualifications: ["Licensed Pest Control Technician", "IPM Certification"],
      rating: 4.7
    },
    notes: "Ant infestation in kitchen",
    createdAt: "2025-01-02T03:00:00Z",
    updatedAt: "2025-01-02T03:00:00Z"
  }
];

/**
 * Get available time slots for a specific date and service type
 * 
 * @param date - The date to check availability for
 * @param serviceType - The type of service being scheduled
 * @returns Array of available time slots
 */
export const getAvailableTimeSlots = async (date: string, serviceType: string): Promise<string[]> => {
  // In a real application, this would check against actual booked appointments
  // For now, return mock data excluding times from mockAppointments
  const bookedSlots = mockAppointments
    .filter(apt => apt.date === date)
    .map(apt => apt.time);
  
  return timeSlots.filter(slot => !bookedSlots.includes(slot));
};

/**
 * Create a new appointment in the system
 * 
 * @param appointmentData - The appointment data excluding auto-generated fields
 * @returns The created appointment with generated ID and timestamps
 * @throws Error if appointment creation fails
 */
export const createAppointment = async (
  appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Appointment> => {
  // In a real application, this would create an appointment in the database
  const appointment: Appointment = {
    ...appointmentData,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // In a real application, we would save this to a database
  // mockAppointments.push(appointment);
  
  return appointment;
};
