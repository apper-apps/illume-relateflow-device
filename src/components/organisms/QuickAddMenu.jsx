import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Modal from "@/components/molecules/Modal";
import ContactForm from "@/components/organisms/ContactForm";
import DealForm from "@/components/organisms/DealForm";
import ActivityForm from "@/components/organisms/ActivityForm";

const QuickAddMenu = ({ isOpen, onClose, onContactAdded, onDealAdded, onActivityAdded }) => {
  const [activeForm, setActiveForm] = useState(null);

  const quickAddOptions = [
    {
      id: "contact",
      label: "Add Contact",
      icon: "UserPlus",
      description: "Create a new contact",
      color: "from-primary-500 to-secondary-500"
    },
    {
      id: "deal",
      label: "Add Deal",
      icon: "TrendingUp",
      description: "Create a new opportunity",
      color: "from-accent-500 to-pink-600"
    },
    {
      id: "activity",
      label: "Log Activity",
      icon: "Activity",
      description: "Record an interaction",
      color: "from-success-500 to-emerald-600"
    }
  ];

  const handleOptionClick = (optionId) => {
    setActiveForm(optionId);
  };

  const handleFormClose = () => {
    setActiveForm(null);
    onClose();
  };

  const handleFormSuccess = (type, data) => {
    if (type === "contact") onContactAdded?.(data);
    if (type === "deal") onDealAdded?.(data);
    if (type === "activity") onActivityAdded?.(data);
    handleFormClose();
  };

  return (
    <>
      {/* Quick Add Menu */}
      <AnimatePresence>
        {isOpen && !activeForm && (
          <div className="fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
            />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Quick Add</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>

                <div className="space-y-3">
                  {quickAddOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleOptionClick(option.id)}
                      className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all duration-200 group hover:shadow-md"
                    >
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${option.color} group-hover:scale-110 transition-transform duration-200`}>
                        <ApperIcon name={option.icon} size={20} className="text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="font-medium text-gray-900 group-hover:text-gray-700">
                          {option.label}
                        </h4>
                        <p className="text-sm text-gray-600">{option.description}</p>
                      </div>
                      <ApperIcon name="ChevronRight" size={18} className="text-gray-400 ml-auto group-hover:text-gray-600" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Forms */}
      <Modal
        isOpen={activeForm === "contact"}
        onClose={handleFormClose}
        title="Add New Contact"
        size="lg"
      >
        <ContactForm
          onSubmit={(data) => handleFormSuccess("contact", data)}
          onCancel={handleFormClose}
        />
      </Modal>

      <Modal
        isOpen={activeForm === "deal"}
        onClose={handleFormClose}
        title="Add New Deal"
        size="lg"
      >
        <DealForm
          onSubmit={(data) => handleFormSuccess("deal", data)}
          onCancel={handleFormClose}
        />
      </Modal>

      <Modal
        isOpen={activeForm === "activity"}
        onClose={handleFormClose}
        title="Log New Activity"
        size="lg"
      >
        <ActivityForm
          onSubmit={(data) => handleFormSuccess("activity", data)}
          onCancel={handleFormClose}
        />
      </Modal>
    </>
  );
};

export default QuickAddMenu;