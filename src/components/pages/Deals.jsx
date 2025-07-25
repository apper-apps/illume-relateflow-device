import React, { useState, useEffect } from "react";
import DealPipeline from "@/components/organisms/DealPipeline";
import Modal from "@/components/molecules/Modal";
import DealForm from "@/components/organisms/DealForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import { dealService } from "@/services/api/dealService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [showDealForm, setShowDealForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ]);
      
      setDeals(dealsData);
      setContacts(contactsData);
    } catch (err) {
      setError("Failed to load deals data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowDealForm(true);
  };

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowDealForm(true);
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm("Are you sure you want to delete this deal?")) {
      return;
    }

    try {
      await dealService.delete(dealId);
      setDeals(prev => prev.filter(deal => deal.Id !== dealId));
      toast.success("Deal deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete deal");
    }
  };

  const handleStageChange = async (dealId, newStage) => {
    if (!newStage) return;

    try {
      const deal = deals.find(d => d.Id === dealId);
      if (!deal) return;

      const updatedDeal = await dealService.update(dealId, { 
        ...deal, 
        stage: newStage 
      });
      
      setDeals(prev => prev.map(d => 
        d.Id === dealId ? updatedDeal : d
      ));
      
      toast.success(`Deal moved to ${newStage}!`);
    } catch (error) {
      toast.error("Failed to update deal stage");
    }
  };

  const handleDealSubmit = (dealData) => {
    if (selectedDeal) {
      setDeals(prev => prev.map(deal => 
        deal.Id === selectedDeal.Id ? dealData : deal
      ));
    } else {
      setDeals(prev => [...prev, dealData]);
    }
    setShowDealForm(false);
    setSelectedDeal(null);
  };

  if (loading) {
    return <Loading type="deals" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
            Sales Pipeline
          </h2>
          <p className="text-gray-600 mt-1">
            Track your deals through the sales process
          </p>
        </div>
        
        <Button
          onClick={handleAddDeal}
          variant="primary"
          icon="Plus"
          size="lg"
        >
          Add Deal
        </Button>
      </div>

      {/* Pipeline */}
      <DealPipeline
        deals={deals}
        contacts={contacts}
        onEditDeal={handleEditDeal}
        onDeleteDeal={handleDeleteDeal}
        onStageChange={handleStageChange}
        onAddDeal={handleAddDeal}
      />

      {/* Deal Form Modal */}
      <Modal
        isOpen={showDealForm}
        onClose={() => {
          setShowDealForm(false);
          setSelectedDeal(null);
        }}
        title={selectedDeal ? "Edit Deal" : "Add New Deal"}
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          onSubmit={handleDealSubmit}
          onCancel={() => {
            setShowDealForm(false);
            setSelectedDeal(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Deals;