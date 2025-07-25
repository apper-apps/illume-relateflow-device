import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";

const ActivityItem = ({ activity, contact, deal, onEdit, onDelete }) => {
  const getActivityIcon = (type) => {
    const icons = {
      "call": "Phone",
      "email": "Mail",
      "meeting": "Users",
      "note": "FileText",
      "task": "CheckSquare"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (type) => {
    const colors = {
      "call": "success",
      "email": "primary",
      "meeting": "accent",
      "note": "warning",
      "task": "secondary"
    };
    return colors[type] || "default";
  };

  const formatDuration = (minutes) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className={`p-2.5 rounded-lg bg-gradient-to-r ${getActivityColorGradient(getActivityColor(activity.type))}`}>
            <ApperIcon 
              name={getActivityIcon(activity.type)} 
              size={18} 
              className="text-white" 
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">
                  {activity.description}
                </h4>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  {contact && (
                    <span className="flex items-center gap-1">
                      <ApperIcon name="User" size={14} />
                      {contact.name}
                    </span>
                  )}
                  {deal && (
                    <span className="flex items-center gap-1">
                      <ApperIcon name="TrendingUp" size={14} />
                      {deal.title}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(activity)}
                  className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-all duration-200"
                  title="Edit Activity"
                >
                  <ApperIcon name="Edit" size={14} />
                </button>
                <button
                  onClick={() => onDelete(activity.Id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                  title="Delete Activity"
                >
                  <ApperIcon name="Trash2" size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={getActivityColor(activity.type)} size="sm">
                  {activity.type}
                </Badge>
                
                {activity.duration && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <ApperIcon name="Clock" size={12} />
                    {formatDuration(activity.duration)}
                  </span>
                )}
              </div>
              
              <span className="text-sm text-gray-500">
                {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const getActivityColorGradient = (color) => {
  const gradients = {
    primary: "from-primary-500 to-secondary-500",
    success: "from-success-500 to-emerald-600",
    warning: "from-warning-500 to-orange-600",
    danger: "from-red-500 to-rose-600",
    accent: "from-accent-500 to-pink-600",
    secondary: "from-purple-500 to-indigo-600",
    default: "from-gray-500 to-slate-600"
  };
  return gradients[color] || gradients.default;
};

export default ActivityItem;