import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LeadFormProps {
  category: string
  service: string
}

interface FormData {
  name: string
  email: string
  phone: string
  serviceNeeded: string
  urgency: string
  preferredTime: string
  propertyType: string
  message: string
}

export function LeadForm({ category, service }: LeadFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    serviceNeeded: `${category} - ${service}`,
    urgency: "",
    preferredTime: "",
    propertyType: "",
    message: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // TODO: Integrate with your backend API
      console.log("Form submitted:", formData)
      
      toast({
        title: "Request Submitted",
        description: "We'll get back to you shortly!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 555-5555"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="urgency">Urgency</Label>
          <Select
            value={formData.urgency}
            onValueChange={(value) => setFormData({ ...formData, urgency: value })}
          >
            <SelectTrigger id="urgency">
              <SelectValue placeholder="Select urgency level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Within 1 week</SelectItem>
              <SelectItem value="medium">Medium - Within 48 hours</SelectItem>
              <SelectItem value="high">High - Within 24 hours</SelectItem>
              <SelectItem value="emergency">Emergency - ASAP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="preferredTime">Preferred Time</Label>
          <Select
            value={formData.preferredTime}
            onValueChange={(value) => setFormData({ ...formData, preferredTime: value })}
          >
            <SelectTrigger id="preferredTime">
              <SelectValue placeholder="Select preferred time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 4PM)</SelectItem>
              <SelectItem value="evening">Evening (4PM - 8PM)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="propertyType">Property Type</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
          >
            <SelectTrigger id="propertyType">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">Additional Details</Label>
          <Textarea
            id="message"
            placeholder="Please provide any additional details about your service request..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="min-h-[100px]"
          />
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        aria-label="Submit Service Request"
      >
        Submit Request
      </Button>
    </form>
  )
}
