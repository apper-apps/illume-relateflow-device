import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ContactCard = ({ contact, onEdit, onDelete, onViewDeals }) => {
const getInitials = (name) => {
    if (!name || typeof name !== 'string') {
      return 'NA';
    }
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

const generateAvatarColor = (name) => {
    const colors = [
      "from-primary-500 to-secondary-500",
      "from-accent-500 to-pink-600",
      "from-green-500 to-emerald-600",
      "from-orange-500 to-yellow-600",
      "from-purple-500 to-indigo-600",
      "from-red-500 to-rose-600"
    ];
    const safeName = name || 'Unknown';
    const index = safeName.length % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
<div className={`w-12 h-12 rounded-full bg-gradient-to-r ${generateAvatarColor(contact.Name)} flex items-center justify-center text-white font-semibold shadow-lg`}>
              {getInitials(contact.Name)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{contact.Name || 'Unknown'}</h3>
              <p className="text-sm text-gray-600">{contact.role || 'Unknown'} at {contact.company || 'Unknown'}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewDeals(contact)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              title="View Deals"
            >
              <ApperIcon name="TrendingUp" size={18} />
            </button>
            <button
              onClick={() => onEdit(contact)}
              className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200"
              title="Edit Contact"
            >
              <ApperIcon name="Edit" size={18} />
            </button>
            <button
              onClick={() => onDelete(contact.Id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete Contact"
            >
              <ApperIcon name="Trash2" size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
<ApperIcon name="Mail" size={16} />
            <span>{contact.email || 'No email'}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
<ApperIcon name="Phone" size={16} />
            <span>{contact.phone || 'No phone'}</span>
          </div>
          
          {contact.notes && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <ApperIcon name="FileText" size={16} className="mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{contact.notes}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <Badge variant="primary" size="sm">
<ApperIcon name="Calendar" size={12} className="mr-1" />
            {contact.createdAt ? format(new Date(contact.createdAt), "MMM d, yyyy") : 'Unknown'}
          </Badge>
          
          {contact.lastActivity && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
<ApperIcon name="Clock" size={12} />
              Last activity: {format(new Date(contact.lastActivity), "MMM d")}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default ContactCard;