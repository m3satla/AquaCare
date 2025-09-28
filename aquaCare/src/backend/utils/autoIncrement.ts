import Counter from '../models/Counter';

/**
 * Auto-increment middleware for Mongoose schemas
 * Generates sequential numeric IDs for collections
 */
export const autoIncrementMiddleware = (collectionName: string) => {
  return async function (this: any, next: any) {
    try {
      // Only generate ID if it's a new document and no custom ID is set
      if (this.isNew && !this.id) {
        const counter = await Counter.findByIdAndUpdate(
          collectionName,
          { $inc: { sequenceValue: 1 } },
          { new: true, upsert: true }
        );
        
        this.id = counter.sequenceValue;
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Get next sequence number for a collection without incrementing
 */
export const getNextSequence = async (collectionName: string): Promise<number> => {
  const counter = await Counter.findById(collectionName);
  return counter ? counter.sequenceValue + 1 : 1;
};

/**
 * Reset counter for a collection (useful for testing/development)
 */
export const resetCounter = async (collectionName: string, value: number = 0): Promise<void> => {
  await Counter.findByIdAndUpdate(
    collectionName,
    { sequenceValue: value },
    { upsert: true }
  );
};

/**
 * Get current counter value for a collection
 */
export const getCurrentCount = async (collectionName: string): Promise<number> => {
  const counter = await Counter.findById(collectionName);
  return counter ? counter.sequenceValue : 0;
}; 