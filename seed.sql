-- Insert test users
INSERT INTO users (email, full_name, role, subscription_tier, company_name, phone_number, address) VALUES
('admin@example.com', 'Admin User', 'admin', 'enterprise', 'Admin Corp', '+1234567890', '{"street": "123 Admin St", "city": "Admin City", "state": "AS", "zip": "12345"}'::jsonb),
('contractor1@example.com', 'John Smith', 'contractor', 'premium', 'Smith Repairs', '+1234567891', '{"street": "456 Service Rd", "city": "Service City", "state": "SC", "zip": "23456"}'::jsonb),
('contractor2@example.com', 'Jane Doe', 'contractor', 'premium', 'Doe Maintenance', '+1234567892', '{"street": "789 Fix Ave", "city": "Fix City", "state": "FC", "zip": "34567"}'::jsonb),
('user1@example.com', 'Regular User', 'user', 'basic', NULL, '+1234567893', '{"street": "321 User Lane", "city": "User City", "state": "UC", "zip": "45678"}'::jsonb),
('user2@example.com', 'Premium User', 'user', 'premium', NULL, '+1234567894', '{"street": "654 Premium Blvd", "city": "Premium City", "state": "PC", "zip": "56789"}'::jsonb);

-- Insert contractors
INSERT INTO contractors (user_id, company_name, services, license_number, insurance_info, service_areas, rating, availability, pricing) VALUES
((SELECT id FROM users WHERE email = 'contractor1@example.com'),
 'Smith Repairs',
 ARRAY['plumbing', 'electrical', 'hvac'],
 'LIC123456',
 '{"provider": "SafeGuard Insurance", "policy_number": "POL123", "expiration_date": "2024-12-31"}'::jsonb,
 ARRAY['New York', 'Brooklyn', 'Queens'],
 4.8,
 '{"schedule": [{"day": "Monday", "hours": ["09:00-17:00"]}, {"day": "Tuesday", "hours": ["09:00-17:00"]}, {"day": "Wednesday", "hours": ["09:00-17:00"]}, {"day": "Thursday", "hours": ["09:00-17:00"]}, {"day": "Friday", "hours": ["09:00-17:00"]}], "emergency_available": true}'::jsonb,
 '{"hourly_rate": 85, "service_rates": {"plumbing": 95, "electrical": 90, "hvac": 100}, "minimum_charge": 50}'::jsonb),
((SELECT id FROM users WHERE email = 'contractor2@example.com'),
 'Doe Maintenance',
 ARRAY['carpentry', 'painting', 'general_maintenance'],
 'LIC789012',
 '{"provider": "SecureGuard Insurance", "policy_number": "POL456", "expiration_date": "2024-12-31"}'::jsonb,
 ARRAY['Manhattan', 'Bronx', 'Staten Island'],
 4.9,
 '{"schedule": [{"day": "Monday", "hours": ["08:00-16:00"]}, {"day": "Tuesday", "hours": ["08:00-16:00"]}, {"day": "Wednesday", "hours": ["08:00-16:00"]}, {"day": "Thursday", "hours": ["08:00-16:00"]}, {"day": "Friday", "hours": ["08:00-16:00"]}], "emergency_available": false}'::jsonb,
 '{"hourly_rate": 75, "service_rates": {"carpentry": 85, "painting": 70, "general_maintenance": 75}, "minimum_charge": 45}'::jsonb);

-- Insert service requests
INSERT INTO service_requests (user_id, contractor_id, service_type, status, priority, description, location, preferred_schedule, estimated_cost, actual_cost) VALUES
((SELECT id FROM users WHERE email = 'user1@example.com'),
 (SELECT id FROM contractors WHERE company_name = 'Smith Repairs'),
 'plumbing',
 'completed',
 'high',
 'Leaking pipe under kitchen sink',
 '{"address": "321 User Lane", "unit": "2B", "access_instructions": "Key under mat"}'::jsonb,
 '{"date": "2024-01-05", "time_slots": ["09:00-12:00"]}'::jsonb,
 150.00,
 175.50),
((SELECT id FROM users WHERE email = 'user2@example.com'),
 (SELECT id FROM contractors WHERE company_name = 'Doe Maintenance'),
 'carpentry',
 'in_progress',
 'medium',
 'Replace damaged kitchen cabinets',
 '{"address": "654 Premium Blvd", "unit": "15A", "access_instructions": "Call upon arrival"}'::jsonb,
 '{"date": "2024-01-10", "time_slots": ["13:00-16:00"]}'::jsonb,
 800.00,
 NULL);

-- Insert contractor reviews
INSERT INTO contractor_reviews (contractor_id, user_id, request_id, rating, comment) VALUES
((SELECT id FROM contractors WHERE company_name = 'Smith Repairs'),
 (SELECT id FROM users WHERE email = 'user1@example.com'),
 (SELECT id FROM service_requests WHERE description = 'Leaking pipe under kitchen sink'),
 5,
 'Excellent service! Fixed the leak quickly and professionally.');

-- Insert maintenance schedules
INSERT INTO maintenance_schedules (user_id, name, description, frequency, next_due_date, last_completed, tasks) VALUES
((SELECT id FROM users WHERE email = 'user1@example.com'),
 'Home Maintenance Schedule',
 'Regular home maintenance tasks',
 'monthly',
 '2024-01-15',
 '2023-12-15',
 ARRAY['{"task": "HVAC Filter Change", "category": "HVAC", "priority": "medium"}', '{"task": "Plumbing Inspection", "category": "Plumbing", "priority": "low"}']::jsonb[]);

-- Insert notifications
INSERT INTO notifications (user_id, type, title, message, action_url) VALUES
((SELECT id FROM users WHERE email = 'user1@example.com'),
 'maintenance',
 'Maintenance Due',
 'HVAC filter change is due in 3 days',
 '/maintenance/schedule'),
((SELECT id FROM users WHERE email = 'user2@example.com'),
 'request',
 'Service Request Update',
 'Your cabinet replacement is 50% complete',
 '/requests/details');

-- Insert notification preferences
INSERT INTO notification_preferences (user_id, email_notifications, push_notifications, sms_notifications, notification_types) VALUES
((SELECT id FROM users WHERE email = 'user1@example.com'),
 true,
 true,
 false,
 '{"maintenance_reminders": true, "request_updates": true, "quote_received": true, "payment_reminders": true, "system_updates": false}'::jsonb);

-- Insert analytics events
INSERT INTO analytics_events (user_id, event_type, properties) VALUES
((SELECT id FROM users WHERE email = 'user1@example.com'),
 'service_request_created',
 '{"service_type": "plumbing", "priority": "high"}'::jsonb),
((SELECT id FROM users WHERE email = 'user2@example.com'),
 'contractor_search',
 '{"service_type": "carpentry", "location": "Premium City"}'::jsonb);

-- Insert scheduled reports
INSERT INTO scheduled_reports (user_id, type, title, description, filters, schedule) VALUES
((SELECT id FROM users WHERE email = 'admin@example.com'),
 'maintenance',
 'Monthly Maintenance Report',
 'Overview of all maintenance activities',
 '{"status": ["completed", "in_progress"], "date_range": "monthly"}'::jsonb,
 '{"frequency": "monthly", "day": 1, "time": "00:00"}'::jsonb);
