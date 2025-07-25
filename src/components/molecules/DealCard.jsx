import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const DealCard = ({ deal, contact, onEdit, onDelete, onStageChange, isDragging = false }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return "success";
    if (probability >= 60) return "primary";
    if (probability >= 40) return "warning";
    return "danger";
  };

  const getStageColor = (stage) => {
    const colors = {
      "Lead": "default",
      "Qualified": "primary",
      "Proposal": "warning",
      "Negotiation": "accent",
      "Closed Won": "success",
      "Closed Lost": "danger"
    };
    return colors[stage] || "default";
  };

  return (
    <motion.div
      whileHover={!isDragging ? { scale: 1.02 } : {}}
      whileDrag={{ scale: 1.05, rotate: 2 }}
      className={isDragging ? "dragging" : ""}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-200 cursor-move">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-900 truncate mb-1">{deal.title}</h4>
            <p className="text-sm text-gray-600 truncate">{contact?.name || "Unknown Contact"}</p>
          </div>
          
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={() => onEdit(deal)}
              className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all duration-200"
              title="Edit Deal"
            >
              <ApperIcon name="Edit" size={14} />
            </button>
            <button
              onClick={() => onDelete(deal.Id)}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
              title="Delete Deal"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text">
            {formatCurrency(deal.value)}
          </div>
          
          <div className="flex items-center justify-between">
            <Badge variant={getProbabilityColor(deal.probability)} size="sm">
              {deal.probability}% chance
            </Badge>
            
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <ApperIcon name="Calendar" size={12} />
              {format(new Date(deal.expectedClose), "MMM d")}
            </div>
          </div>
        </div>

        {/* Stage Change Buttons */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => onStageChange(deal.Id, getPreviousStage(deal.stage))}
              disabled={!getPreviousStage(deal.stage)}
              className="text-xs py-1 px-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <ApperIcon name="ChevronLeft" size={12} className="inline mr-1" />
              Previous
            </button>
            <button
              onClick={() => onStageChange(deal.Id, getNextStage(deal.stage))}
              disabled={!getNextStage(deal.stage)}
              className="text-xs py-1 px-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Next
              <ApperIcon name="ChevronRight" size={12} className="inline ml-1" />
            </button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const getPreviousStage = (currentStage) => {
  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];
  const currentIndex = stages.indexOf(currentStage);
  return currentIndex > 0 ? stages[currentIndex - 1] : null;
};

const getNextStage = (currentStage) => {
  const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];
  const currentIndex = stages.indexOf(currentStage);
  return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null;
};

export default DealCard;