import React, { useState } from "react";
import { motion } from "framer-motion";
import DealCard from "@/components/molecules/DealCard";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Empty from "@/components/ui/Empty";

const DealPipeline = ({ 
  deals = [], 
  contacts = [], 
  onEditDeal, 
  onDeleteDeal, 
  onStageChange, 
  onAddDeal 
}) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);

  const stages = [
    { id: "Lead", name: "Lead", color: "bg-gray-100" },
    { id: "Qualified", name: "Qualified", color: "bg-blue-100" },
    { id: "Proposal", name: "Proposal", color: "bg-yellow-100" },
    { id: "Negotiation", name: "Negotiation", color: "bg-purple-100" },
    { id: "Closed Won", name: "Closed Won", color: "bg-green-100" }
  ];

  const getDealsForStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getContactForDeal = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getStageValue = (stage) => {
    const stageDeals = getDealsForStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = (e, stage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (draggedDeal && draggedDeal.stage !== stage) {
      onStageChange(draggedDeal.Id, stage);
    }
    
    setDraggedDeal(null);
  };

  if (deals.length === 0) {
    return (
      <Empty
        title="No deals in your pipeline"
        description="Start building your sales pipeline by creating your first deal opportunity."
        actionLabel="Add First Deal"
        onAction={onAddDeal}
        icon="TrendingUp"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Pipeline Overview</h3>
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text">
            {formatCurrency(deals.reduce((total, deal) => total + deal.value, 0))}
          </div>
        </div>
        
        <div className="grid grid-cols-5 gap-4">
          {stages.map(stage => (
            <div key={stage.id} className="text-center">
              <div className="text-sm text-gray-600 mb-1">{stage.name}</div>
              <div className="font-semibold text-gray-900">
                {formatCurrency(getStageValue(stage.id))}
              </div>
              <div className="text-xs text-gray-500">
                {getDealsForStage(stage.id).length} deals
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 min-h-[600px]">
        {stages.map(stage => (
          <div
            key={stage.id}
            className={`${stage.color} rounded-xl p-4 ${
              dragOverStage === stage.id ? "drag-over" : ""
            }`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{stage.name}</h3>
                <p className="text-sm text-gray-600">
                  {getDealsForStage(stage.id).length} deals
                </p>
              </div>
              <div className="text-sm font-medium text-gray-700">
                {formatCurrency(getStageValue(stage.id))}
              </div>
            </div>

            <div className="space-y-3 custom-scrollbar max-h-[500px] overflow-y-auto">
              {getDealsForStage(stage.id).map(deal => (
                <div
                  key={deal.Id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, deal)}
                >
                  <DealCard
                    deal={deal}
                    contact={getContactForDeal(deal.contactId)}
                    onEdit={onEditDeal}
                    onDelete={onDeleteDeal}
                    onStageChange={onStageChange}
                    isDragging={draggedDeal?.Id === deal.Id}
                  />
                </div>
              ))}
              
              {getDealsForStage(stage.id).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="Plus" size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Drop deals here</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DealPipeline;