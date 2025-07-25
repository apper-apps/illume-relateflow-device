import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [preferences, setPreferences] = useState({
    companyName: "Your Company",
    currency: "USD",
    timezone: "America/New_York",
    dateFormat: "MM/dd/yyyy",
    defaultDealStage: "Lead",
    defaultDealProbability: 10,
    notifications: {
      email: true,
      browser: true,
      dealUpdates: true,
      activityReminders: true
    }
  });

  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handlePreferenceChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast.success("Settings saved successfully!");
  };

  const handleImportData = async () => {
    setImporting(true);
    // Simulate import process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setImporting(false);
    toast.success("Data imported successfully!");
  };

  const handleExportData = async () => {
    setExporting(true);
    // Simulate export process
    await new Promise(resolve => setTimeout(resolve, 1500));
    setExporting(false);
    toast.success("Data exported successfully!");
  };

  const settingSections = [
    {
      title: "General Settings",
      description: "Configure your basic CRM preferences",
      icon: "Settings",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Company Name"
              value={preferences.companyName}
              onChange={(e) => handlePreferenceChange("companyName", e.target.value)}
              placeholder="Your Company Name"
            />
            
            <Select
              label="Default Currency"
              value={preferences.currency}
              onChange={(e) => handlePreferenceChange("currency", e.target.value)}
            >
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="CAD">CAD - Canadian Dollar</option>
            </Select>
            
            <Select
              label="Timezone"
              value={preferences.timezone}
              onChange={(e) => handlePreferenceChange("timezone", e.target.value)}
            >
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </Select>
            
            <Select
              label="Date Format"
              value={preferences.dateFormat}
              onChange={(e) => handlePreferenceChange("dateFormat", e.target.value)}
            >
              <option value="MM/dd/yyyy">MM/DD/YYYY</option>
              <option value="dd/MM/yyyy">DD/MM/YYYY</option>
              <option value="yyyy-MM-dd">YYYY-MM-DD</option>
            </Select>
          </div>
        </div>
      )
    },
    {
      title: "Deal Defaults",
      description: "Set default values for new deals",
      icon: "TrendingUp",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Default Deal Stage"
              value={preferences.defaultDealStage}
              onChange={(e) => handlePreferenceChange("defaultDealStage", e.target.value)}
            >
              <option value="Lead">Lead</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal">Proposal</option>
              <option value="Negotiation">Negotiation</option>
            </Select>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Default Probability ({preferences.defaultDealProbability}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={preferences.defaultDealProbability}
                onChange={(e) => handlePreferenceChange("defaultDealProbability", parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Notifications",
      description: "Control when and how you receive notifications",
      icon: "Bell",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            {[
              { key: "email", label: "Email Notifications", description: "Receive notifications via email" },
              { key: "browser", label: "Browser Notifications", description: "Show desktop notifications" },
              { key: "dealUpdates", label: "Deal Updates", description: "Notify when deals change stage" },
              { key: "activityReminders", label: "Activity Reminders", description: "Remind about scheduled activities" }
            ].map(notification => (
              <div key={notification.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{notification.label}</h4>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.notifications[notification.key]}
                    onChange={(e) => handleNotificationChange(notification.key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Data Management",
      description: "Import and export your CRM data",
      icon: "Database",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg">
                  <ApperIcon name="Upload" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Import Data</h4>
                  <p className="text-sm text-gray-600">Import contacts and deals from CSV</p>
                </div>
              </div>
              <Button
                onClick={handleImportData}
                loading={importing}
                variant="primary"
                size="sm"
                icon="Upload"
                className="w-full"
              >
                Import CSV
              </Button>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-accent-50 to-pink-50 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-accent-500 to-pink-600 rounded-lg">
                  <ApperIcon name="Download" size={20} className="text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Export Data</h4>
                  <p className="text-sm text-gray-600">Download your data as CSV</p>
                </div>
              </div>
              <Button
                onClick={handleExportData}
                loading={exporting}
                variant="accent"
                size="sm"
                icon="Download"
                className="w-full"
              >
                Export CSV
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <ApperIcon name="AlertTriangle" size={20} className="text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Data Backup Reminder</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Regularly export your data to keep backups of your important CRM information.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-transparent bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text mb-2">
          Settings
        </h2>
        <p className="text-gray-600">
          Configure your CRM preferences and manage your data
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-8">
        {settingSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="p-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl">
                  <ApperIcon name={section.icon} size={24} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-gray-600 mt-1">{section.description}</p>
                </div>
              </div>
              
              {section.content}
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <Button
          onClick={handleSaveSettings}
          variant="primary"
          size="lg"
          icon="Save"
        >
          Save All Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;