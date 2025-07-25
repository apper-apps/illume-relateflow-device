import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";

const ActivityForm = ({ activity = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: activity?.type || "call",
    description: activity?.description || "",
    contactId: activity?.contactId || "",
    dealId: activity?.dealId || "",
    timestamp: activity?.timestamp ? new Date(activity.timestamp).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    duration: activity?.duration || ""
  });
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errors, setErrors] = useState({});

  const activityTypes = [
    { value: "call", label: "Phone Call" },
    { value: "email", label: "Email" },
    { value: "meeting", label: "Meeting" },
    { value: "note", label: "Note" },
    { value: "task", label: "Task" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [contactsData, dealsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll()
      ]);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setIsLoadingData(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.contactId && !formData.dealId) {
      newErrors.contactId = "Please select either a contact or deal";
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
      const submitData = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        timestamp: new Date(formData.timestamp).toISOString()
      };

      let result;
      if (activity) {
        result = await activityService.update(activity.Id, submitData);
        toast.success("Activity updated successfully!");
      } else {
        result = await activityService.create(submitData);
        toast.success("Activity logged successfully!");
      }
      
      onSubmit(result);
    } catch (error) {
      toast.error("Failed to save activity. Please try again.");
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
        <Select
          label="Activity Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          {activityTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </Select>
        
        <Input
          label="Duration (minutes)"
          name="duration"
          type="number"
          min="1"
          value={formData.duration}
          onChange={handleChange}
          placeholder="Optional"
        />
        
        <Select
          label="Contact"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          error={errors.contactId}
          disabled={isLoadingData}
        >
          <option value="">
            {isLoadingData ? "Loading contacts..." : "Select a contact (optional)"}
          </option>
          {contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name} - {contact.company}
            </option>
          ))}
        </Select>
        
        <Select
          label="Related Deal"
          name="dealId"
          value={formData.dealId}
          onChange={handleChange}
          disabled={isLoadingData}
        >
          <option value="">
            {isLoadingData ? "Loading deals..." : "Select a deal (optional)"}
          </option>
          {deals.map(deal => (
            <option key={deal.Id} value={deal.Id}>
              {deal.title} - ${deal.value?.toLocaleString()}
            </option>
          ))}
        </Select>
        
        <div className="md:col-span-2">
          <Input
            label="Date & Time"
            name="timestamp"
            type="datetime-local"
            value={formData.timestamp}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
          placeholder="Describe what happened during this interaction..."
          required
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1">{errors.description}</p>
        )}
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
          {activity ? "Update Activity" : "Log Activity"}
        </Button>
      </div>
    </form>
  );
};

export default ActivityForm;