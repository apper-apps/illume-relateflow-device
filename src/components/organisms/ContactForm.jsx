import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { contactService } from "@/services/api/contactService";

const ContactForm = ({ contact = null, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    name: contact?.Name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    role: contact?.role || "",
    notes: contact?.notes || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    if (!formData.company.trim()) {
      newErrors.company = "Company is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsSubmitting(true);
    
    try {
      let result;
      if (contact) {
        result = await contactService.update(contact.Id, formData);
        toast.success("Contact updated successfully!");
      } else {
        result = await contactService.create(formData);
        toast.success("Contact created successfully!");
      }
      
      // Ensure we have a valid result before calling onSubmit
      if (result) {
        onSubmit(result);
      } else {
        throw new Error("No data returned from service");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Failed to save contact. Please try again.");
      // Don't call onSubmit on error to prevent state issues
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
          placeholder="Enter full name"
        />
        
        <Input
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
          placeholder="email@company.com"
        />
        
        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          required
          placeholder="+1 (555) 123-4567"
        />
        
        <Input
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          error={errors.company}
          required
          placeholder="Company name"
        />
        
        <div className="md:col-span-2">
          <Input
            label="Job Title/Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g., Marketing Manager"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
          placeholder="Additional notes about this contact..."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          icon="Save"
        >
          {contact ? "Update Contact" : "Create Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;