import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "increase",
  icon,
  color = "primary",
  formatter = (val) => val,
  isLoading = false
}) => {
  const colorClasses = {
    primary: "from-primary-500 to-secondary-500",
    success: "from-success-500 to-emerald-600",
    warning: "from-warning-500 to-orange-600",
    danger: "from-red-500 to-rose-600",
    accent: "from-accent-500 to-pink-600"
  };

  const changeIcon = changeType === "increase" ? "TrendingUp" : "TrendingDown";
  const changeColor = changeType === "increase" ? "text-success-600" : "text-red-600";

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="h-5 w-24 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
          <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg animate-shimmer"></div>
        </div>
        <div className="h-10 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer mb-2"></div>
        <div className="h-4 w-16 bg-gradient-to-r from-slate-200 to-slate-300 rounded animate-shimmer"></div>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} bg-opacity-10`}>
            <ApperIcon 
              name={icon} 
              size={20} 
              className={`text-transparent bg-gradient-to-r ${colorClasses[color]} bg-clip-text`} 
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className={`text-3xl font-bold text-transparent bg-gradient-to-r ${colorClasses[color]} bg-clip-text`}>
            {formatter(value)}
          </p>
          
          {change !== undefined && (
            <div className={`flex items-center gap-1 text-sm ${changeColor}`}>
              <ApperIcon name={changeIcon} size={14} />
              <span className="font-medium">{Math.abs(change)}%</span>
              <span className="text-gray-500">vs last month</span>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;