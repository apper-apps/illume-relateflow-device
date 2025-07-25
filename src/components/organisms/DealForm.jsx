import React, { useState, useEffect } from "react";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";

const DealForm = ({ deal = null, onSubmit, onCancel }) => {
const [formData, setFormData] = useState({
    title: deal?.title || "",
    value: deal?.value || "",
    stage: deal?.stage || "Lead",
    contactId: deal?.contactId || "",
    probability: deal?.probability || "3",
    expectedClose: deal?.expectedClose ? new Date(deal.expectedClose).toISOString().split("T")[0] : ""
  });
  const [contacts, setContacts] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [errors, setErrors] = useState({});

  const stages = [
    { value: "Lead", label: "Lead" },
    { value: "Qualified", label: "Qualified" },
    { value: "Proposal", label: "Proposal" },
    { value: "Negotiation", label: "Negotiation" },
    { value: "Closed Won", label: "Closed Won" },
    { value: "Closed Lost", label: "Closed Lost" }
  ];

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contactsData = await contactService.getAll();
      setContacts(contactsData);
    } catch (error) {
      toast.error("Failed to load contacts");
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Deal title is required";
    }
    
    if (!formData.value || formData.value <= 0) {
      newErrors.value = "Deal value must be greater than 0";
    }
    
    if (!formData.contactId) {
      newErrors.contactId = "Please select a contact";
    }
    
    if (!formData.expectedClose) {
      newErrors.expectedClose = "Expected close date is required";
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
        value: parseFloat(formData.value),
        probability: String(formData.probability)
      };

      let result;
      if (deal) {
        result = await dealService.update(deal.Id, submitData);
        toast.success("Deal updated successfully!");
      } else {
        result = await dealService.create(submitData);
        toast.success("Deal created successfully!");
      }
      
      onSubmit(result);
    } catch (error) {
      toast.error("Failed to save deal. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Update probability based on stage
    if (name === "stage") {
const stageProbabilities = {
        "Lead": "1",
        "Qualified": "2",
        "Proposal": "3",
        "Negotiation": "4",
        "Closed Won": "5",
        "Closed Lost": "0"
      };
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        probability: stageProbabilities[value] || prev.probability
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <Input
            label="Deal Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={errors.title}
            required
            placeholder="Enter deal title"
          />
        </div>
        
        <Input
          label="Deal Value"
          name="value"
          type="number"
          step="0.01"
          min="0"
          value={formData.value}
          onChange={handleChange}
          error={errors.value}
          required
          placeholder="0.00"
        />
        
        <Select
          label="Stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          required
        >
          {stages.map(stage => (
            <option key={stage.value} value={stage.value}>
              {stage.label}
            </option>
          ))}
        </Select>
        
        <Select
          label="Contact"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          error={errors.contactId}
          required
          disabled={isLoadingContacts}
        >
          <option value="">
            {isLoadingContacts ? "Loading contacts..." : "Select a contact"}
          </option>
          {contacts.map(contact => (
            <option key={contact.Id} value={contact.Id}>
              {contact.name} - {contact.company}
            </option>
          ))}
        </Select>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Probability ({formData.probability}%)
          </label>
          <input
            type="range"
            name="probability"
            min="0"
            max="100"
            step="5"
            value={formData.probability}
            onChange={handleChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <Input
          label="Expected Close Date"
          name="expectedClose"
          type="date"
          value={formData.expectedClose}
          onChange={handleChange}
          error={errors.expectedClose}
          required
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
          {deal ? "Update Deal" : "Create Deal"}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;