export const StorageUtils = {
  saveCompletionStatus: (cardId: number, status: boolean) => {
    try {
      localStorage.setItem(`completionStatus_${cardId}`, JSON.stringify(status));
    } catch (error) {
      console.error('Failed to save completion status:', error);
    }
  },

  getCompletionStatus: (cardId: number) => {
    try {
      const status = localStorage.getItem(`completionStatus_${cardId}`);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Failed to get completion status:', error);
      return false;
    }
  },

  saveRewardStatus: (status: boolean) => {
    try {
      localStorage.setItem(`rewardStatus`, JSON.stringify(status));
    } catch (error) {
      console.error('Failed to save reward status:', error);
    }
  },

  getRewardStatus: () => {
    try {
      const status = localStorage.getItem(`rewardStatus`);
      return status ? JSON.parse(status) : false;
    } catch (error) {
      console.error('Failed to get reward status:', error);
      return false;
    }
  },

  clearAll: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }
};