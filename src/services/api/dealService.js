class DealService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'deal';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contactId" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "createdAt" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
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
        console.error("Error fetching deals:", error?.response?.data?.message);
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
          { field: { Name: "title" } },
          { field: { Name: "value" } },
          { field: { Name: "stage" } },
          { field: { Name: "contactId" } },
          { field: { Name: "probability" } },
          { field: { Name: "expectedClose" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "createdAt" } }
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
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async create(dealData) {
    try {
      // Only include Updateable fields and handle lookup fields properly
      const params = {
        records: [{
          Name: dealData.title, // Map title to Name field
          title: dealData.title,
          value: parseFloat(dealData.value),
          stage: dealData.stage,
          contactId: parseInt(dealData.contactId), // Lookup field - send as integer ID
          probability: parseInt(dealData.probability),
          expectedClose: dealData.expectedClose,
          Tags: dealData.tags || "",
          createdAt: new Date().toISOString()
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
          console.error(`Failed to create deal ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || "Failed to create deal");
        }
        
        return successfulRecords[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }

  async update(id, dealData) {
    try {
      // Only include Updateable fields and handle lookup fields properly
      const params = {
        records: [{
          Id: parseInt(id),
          Name: dealData.title, // Map title to Name field
          title: dealData.title,
          value: parseFloat(dealData.value),
          stage: dealData.stage,
          contactId: parseInt(dealData.contactId), // Lookup field - send as integer ID
          probability: parseInt(dealData.probability),
          expectedClose: dealData.expectedClose,
          Tags: dealData.tags || ""
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
          console.error(`Failed to update deal ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          throw new Error(failedUpdates[0].message || "Failed to update deal");
        }
        
        return successfulUpdates[0]?.data;
      }
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
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
          console.error(`Failed to delete deal ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          throw new Error(failedDeletions[0].message || "Failed to delete deal");
        }
        
        return successfulDeletions.length > 0;
      }
      
      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
}

export const dealService = new DealService();