// Export all API functions from organized modules
export * from './auth';
export * from './users';
export * from './requests';
export * from './activityLog';
export * from './statistics';

// Re-export types
export type { User } from '../models/User';
export type { Appointment } from '../models/Appointment';
export type { Payment } from '../models/Payment';
export type { Pool } from '../models/Pool';
export type { Simulation } from '../models/Sensor';

// Utility function to log activities
export const logActivity = async (
  userId: string,
  userEmail: string,
  action: string,
  type: string,
  poolId: number,
  details?: string
) => {
  try {
    const { createActivityLog } = await import('./activityLog');
    await createActivityLog({
      userId,
      userEmail,
      action,
      type,
      details,
      poolId
    });
  } catch (error) {
    console.error('❌ Error logging activity:', error);
    // Don't throw error to avoid breaking the main functionality
  }
};
