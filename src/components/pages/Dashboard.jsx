import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { activityService } from "@/services/api/activityService";
import { format } from "date-fns";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [contactsData, dealsData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);
      
      setContacts(contactsData);
      setDeals(dealsData);
      setActivities(activitiesData);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getMetrics = () => {
    const totalDeals = deals.length;
    const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
    const wonDeals = deals.filter(deal => deal.stage === "Closed Won");
    const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
    const avgDealSize = totalDeals > 0 ? totalValue / totalDeals : 0;
    const winRate = totalDeals > 0 ? (wonDeals.length / totalDeals) * 100 : 0;

    return {
      totalContacts: contacts.length,
      totalDeals,
      totalValue,
      avgDealSize,
      winRate,
      recentActivities: activities.slice(0, 5),
      upcomingDeals: deals
        .filter(deal => deal.stage !== "Closed Won" && deal.stage !== "Closed Lost")
        .sort((a, b) => new Date(a.expectedClose) - new Date(b.expectedClose))
        .slice(0, 5)
    };
  };

  const getDealsByStage = () => {
    const stages = ["Lead", "Qualified", "Proposal", "Negotiation", "Closed Won"];
    return stages.map(stage => ({
      stage,
      count: deals.filter(deal => deal.stage === stage).length,
      value: deals
        .filter(deal => deal.stage === stage)
        .reduce((sum, deal) => sum + deal.value, 0)
    }));
  };

  const getContactForDeal = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getContactForActivity = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  const metrics = getMetrics();
  const dealsByStage = getDealsByStage();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
            <p className="text-primary-100 text-lg">
              Here's what's happening with your sales pipeline today.
            </p>
          </div>
          <div className="hidden md:block">
            <ApperIcon name="TrendingUp" size={64} className="text-primary-200" />
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Contacts"
          value={metrics.totalContacts}
          icon="Users"
          color="primary"
          change={12}
          changeType="increase"
        />
        <MetricCard
          title="Active Deals"
          value={metrics.totalDeals}
          icon="TrendingUp"
          color="accent"
          change={8}
          changeType="increase"
        />
        <MetricCard
          title="Pipeline Value"
          value={metrics.totalValue}
          icon="DollarSign"
          color="success"
          formatter={formatCurrency}
          change={15}
          changeType="increase"
        />
        <MetricCard
          title="Win Rate"
          value={`${metrics.winRate.toFixed(1)}%`}
          icon="Target"
          color="warning"
          change={5}
          changeType="increase"
        />
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline by Stage */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ApperIcon name="BarChart3" size={24} className="text-primary-600" />
            Pipeline by Stage
          </h3>
          <div className="space-y-4">
            {dealsByStage.map((stage, index) => (
              <motion.div
                key={stage.stage}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"></div>
                  <span className="font-medium text-gray-900">{stage.stage}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {formatCurrency(stage.value)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stage.count} deals
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Recent Activities */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <ApperIcon name="Activity" size={24} className="text-accent-600" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {metrics.recentActivities.map((activity, index) => {
              const contact = getContactForActivity(activity.contactId);
              return (
                <motion.div
                  key={activity.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  <div className="p-2 bg-gradient-to-r from-accent-100 to-pink-100 rounded-lg">
                    <ApperIcon 
                      name={activity.type === "call" ? "Phone" : activity.type === "email" ? "Mail" : "Users"} 
                      size={16} 
                      className="text-accent-600" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {contact && (
                        <span className="text-sm text-gray-600">{contact.name}</span>
                      )}
                      <Badge variant="default" size="sm">
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(activity.timestamp), "MMM d")}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Upcoming Deals */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <ApperIcon name="Calendar" size={24} className="text-success-600" />
          Upcoming Deal Closures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.upcomingDeals.map((deal, index) => {
            const contact = getContactForDeal(deal.contactId);
            return (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 truncate flex-1">
                    {deal.title}
                  </h4>
                  <Badge variant="primary" size="sm">
                    {deal.stage}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-lg font-bold text-transparent bg-gradient-to-r from-success-600 to-emerald-600 bg-clip-text">
                    {formatCurrency(deal.value)}
                  </div>
                  {contact && (
                    <p className="text-sm text-gray-600">{contact.name}</p>
                  )}
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <ApperIcon name="Calendar" size={14} />
                    {format(new Date(deal.expectedClose), "MMM d, yyyy")}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;