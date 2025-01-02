import { z } from 'zod';

export const appointmentSchema = z.object({
  id: z.string(),
  serviceType: z.string(),
  serviceId: z.string(),
  customerId: z.string(),
  customerName: z.string(),
  customerEmail: z.string(),
  customerPhone: z.string(),
  address: z.string(),
  date: z.string(),
  time: z.string(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().optional(),
  urgencyLevel: z.string(),
  estimatedDuration: z.string(),
  price: z.number(),
  technician: z.object({
    id: z.string(),
    name: z.string(),
    qualifications: z.array(z.string()),
    rating: z.number().optional(),
  }).optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Appointment = z.infer<typeof appointmentSchema>;

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

export const getAvailableTimeSlots = async (date: string, serviceType: string) => {
  // In a real application, this would check against actual booked appointments
  // For now, return mock data excluding times from mockAppointments
  const bookedSlots = mockAppointments
    .filter(apt => apt.date === date)
    .map(apt => apt.time);
  
  return timeSlots.filter(slot => !bookedSlots.includes(slot));
};

export const createAppointment = async (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
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
