class ActivityService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'app_Activity';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "duration" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching activities:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "type" } },
          { field: { Name: "description" } },
          { field: { Name: "contactId" } },
          { field: { Name: "dealId" } },
          { field: { Name: "timestamp" } },
          { field: { Name: "duration" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } }
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching activity with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(activityData) {
    try {
      // Only include Updateable fields and handle lookup fields properly
      const params = {
        records: [{
          Name: activityData.description, // Map description to Name field
          type: activityData.type,
          description: activityData.description,
          contactId: activityData.contactId ? parseInt(activityData.contactId) : null, // Lookup field - send as integer ID
          dealId: activityData.dealId ? parseInt(activityData.dealId) : null, // Lookup field - send as integer ID
          timestamp: activityData.timestamp,
          duration: activityData.duration ? parseInt(activityData.duration) : null,
          Tags: activityData.tags || ""
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create activity ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create activity");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, activityData) {
    try {
      // Only include Updateable fields and handle lookup fields properly
      const params = {
        records: [{
          Id: parseInt(id),
          Name: activityData.description, // Map description to Name field
          type: activityData.type,
          description: activityData.description,
          contactId: activityData.contactId ? parseInt(activityData.contactId) : null, // Lookup field - send as integer ID
          dealId: activityData.dealId ? parseInt(activityData.dealId) : null, // Lookup field - send as integer ID
          timestamp: activityData.timestamp,
          duration: activityData.duration ? parseInt(activityData.duration) : null,
          Tags: activityData.tags || ""
        }]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update activity ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update activity");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete activity ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete activity");
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting activity:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}
export const activityService = new ActivityService();