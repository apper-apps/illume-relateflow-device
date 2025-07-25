import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ActivityItem from "@/components/molecules/ActivityItem";
import SearchBar from "@/components/molecules/SearchBar";
import Modal from "@/components/molecules/Modal";
import ActivityForm from "@/components/organisms/ActivityForm";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import { activityService } from "@/services/api/activityService";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { toast } from "react-toastify";

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [filteredActivities, setFilteredActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showActivityForm, setShowActivityForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortActivities();
  }, [activities, searchTerm, filterType, sortBy]);

  const loadData = async () => {
    try {
      setError("");
      setLoading(true);
      
      const [activitiesData, contactsData, dealsData] = await Promise.all([
        activityService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      
      setActivities(activitiesData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError("Failed to load activities data");
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortActivities = () => {
    let filtered = activities.filter(activity => {
      const matchesSearch = activity.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === "all" || activity.type === filterType;
      return matchesSearch && matchesType;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.timestamp) - new Date(a.timestamp);
        case "oldest":
          return new Date(a.timestamp) - new Date(b.timestamp);
        case "type":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    setFilteredActivities(filtered);
  };

  const handleAddActivity = () => {
    setSelectedActivity(null);
    setShowActivityForm(true);
  };

  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setShowActivityForm(true);
  };

  const handleDeleteActivity = async (activityId) => {
    if (!window.confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      await activityService.delete(activityId);
      setActivities(prev => prev.filter(activity => activity.Id !== activityId));
      toast.success("Activity deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  };

  const handleActivitySubmit = (activityData) => {
    if (selectedActivity) {
      setActivities(prev => prev.map(activity => 
        activity.Id === selectedActivity.Id ? activityData : activity
      ));
    } else {
      setActivities(prev => [...prev, activityData]);
    }
    setShowActivityForm(false);
    setSelectedActivity(null);
  };

  const getContactForActivity = (contactId) => {
    return contacts.find(contact => contact.Id === contactId);
  };

  const getDealForActivity = (dealId) => {
    return deals.find(deal => deal.Id === dealId);
  };

  const getActivityStats = () => {
    const today = new Date();
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      total: activities.length,
      thisWeek: activities.filter(a => new Date(a.timestamp) >= thisWeek).length,
      thisMonth: activities.filter(a => new Date(a.timestamp) >= thisMonth).length,
      byType: activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
      }, {})
    };
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (activities.length === 0) {
    return (
      <Empty
        title="No activities logged yet"
        description="Start tracking your customer interactions by logging your first activity."
        actionLabel="Log First Activity"
        onAction={handleAddActivity}
        icon="Activity"
      />
    );
  }

  const stats = getActivityStats();

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total Activities</div>
        </div>
        <div className="bg-gradient-to-r from-accent-50 to-pink-50 rounded-xl p-6">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-accent-600 to-pink-600 bg-clip-text">
            {stats.thisWeek}
          </div>
          <div className="text-sm text-gray-600">This Week</div>
        </div>
        <div className="bg-gradient-to-r from-success-50 to-emerald-50 rounded-xl p-6">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-success-600 to-emerald-600 bg-clip-text">
            {stats.thisMonth}
          </div>
          <div className="text-sm text-gray-600">This Month</div>
        </div>
        <div className="bg-gradient-to-r from-warning-50 to-orange-50 rounded-xl p-6">
          <div className="flex gap-2 flex-wrap">
            {Object.entries(stats.byType).map(([type, count]) => (
              <Badge key={type} variant="warning" size="sm">
                {type}: {count}
              </Badge>
            ))}
          </div>
          <div className="text-sm text-gray-600 mt-2">By Type</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex-1 max-w-md">
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search activities..."
            onClear={() => setSearchTerm("")}
          />
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="w-32"
          >
            <option value="all">All Types</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="note">Notes</option>
            <option value="task">Tasks</option>
          </Select>
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-32"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="type">By Type</option>
          </Select>
          
          <Button
            onClick={handleAddActivity}
            variant="primary"
            icon="Plus"
            size="md"
          >
            Log Activity
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredActivities.length === activities.length 
            ? `${activities.length} total activities`
            : `${filteredActivities.length} of ${activities.length} activities`
          }
        </p>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <Empty
          title="No activities match your filters"
          description="Try adjusting your search terms or filters."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setFilterType("all");
          }}
          icon="Search"
        />
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((activity, index) => (
            <motion.div
              key={activity.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ActivityItem
                activity={activity}
                contact={getContactForActivity(activity.contactId)}
                deal={getDealForActivity(activity.dealId)}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Activity Form Modal */}
      <Modal
        isOpen={showActivityForm}
        onClose={() => {
          setShowActivityForm(false);
          setSelectedActivity(null);
        }}
        title={selectedActivity ? "Edit Activity" : "Log New Activity"}
        size="lg"
      >
        <ActivityForm
          activity={selectedActivity}
          onSubmit={handleActivitySubmit}
          onCancel={() => {
            setShowActivityForm(false);
            setSelectedActivity(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Activities;