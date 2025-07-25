import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import ContactForm from "@/components/organisms/ContactForm";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import ContactCard from "@/components/molecules/ContactCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterAndSortContacts();
  }, [contacts, searchTerm, sortBy]);

  const loadContacts = async () => {
    try {
      setError("");
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (err) {
      setError("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortContacts = () => {
let filtered = contacts.filter(contact =>
      contact.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );

filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.Name || "").localeCompare(b.Name || "");
        case "company":
          return (a.company || "").localeCompare(b.company || "");
        case "created":
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        case "activity":
          return new Date(b.lastActivity || 0) - new Date(a.lastActivity || 0);
        default:
          return 0;
      }
    });

    setFilteredContacts(filtered);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowContactForm(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowContactForm(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return;
    }

    try {
      await contactService.delete(contactId);
      setContacts(prev => prev.filter(contact => contact.Id !== contactId));
      toast.success("Contact deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

const handleContactSubmit = async (contactData) => {
    try {
      if (selectedContact) {
        // Update existing contact
        setContacts(prev => prev.map(contact => 
          contact.Id === selectedContact.Id ? contactData : contact
        ));
      } else {
        // Add new contact
        setContacts(prev => [...prev, contactData]);
      }
      
      // Close modal and reset form state
      setShowContactForm(false);
      setSelectedContact(null);
      
      // Optionally refresh the contact list to ensure data consistency
      // This prevents any state inconsistencies without causing a full page reload
      setTimeout(() => {
        filterAndSortContacts();
      }, 100);
      
    } catch (error) {
      console.error("Error handling contact submission:", error);
      toast.error("There was an issue updating the contact list");
    }
  };

const handleViewDeals = async (contact) => {
    try {
      const deals = await dealService.getAll();
      const contactDeals = deals.filter(deal => deal.contactId === contact.Id);
      
      if (contactDeals.length === 0) {
        toast.info(`No deals found for ${contact.Name}`);
      } else {
        toast.success(`Found ${contactDeals.length} deals for ${contact.Name}`);
      }
    } catch (error) {
      toast.error("Failed to load deals");
    }
  };

  if (loading) {
    return <Loading type="contacts" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />;
  }

  if (contacts.length === 0) {
    return (
      <Empty
        title="No contacts yet"
        description="Start building your network by adding your first contact."
        actionLabel="Add First Contact"
        onAction={handleAddContact}
        icon="Users"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search contacts..."
            onClear={() => setSearchTerm("")}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-40"
          >
            <option value="name">Sort by Name</option>
            <option value="company">Sort by Company</option>
            <option value="created">Sort by Created</option>
            <option value="activity">Sort by Activity</option>
          </Select>
          
          <Button
            onClick={handleAddContact}
            variant="primary"
            icon="Plus"
            size="md"
          >
            Add Contact
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredContacts.length === contacts.length 
            ? `${contacts.length} total contacts`
            : `${filteredContacts.length} of ${contacts.length} contacts`
          }
        </p>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts match your search"
          description="Try adjusting your search terms or filters."
          actionLabel="Clear Search"
          onAction={() => setSearchTerm("")}
          icon="Search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ContactCard
                contact={contact}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                onViewDeals={handleViewDeals}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Contact Form Modal */}
      <Modal
        isOpen={showContactForm}
        onClose={() => {
          setShowContactForm(false);
          setSelectedContact(null);
        }}
        title={selectedContact ? "Edit Contact" : "Add New Contact"}
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSubmit={handleContactSubmit}
          onCancel={() => {
            setShowContactForm(false);
            setSelectedContact(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Contacts;