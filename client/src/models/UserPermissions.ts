
export interface PlatformPermissions {
  officePlatform: boolean;
  amazonPlatform: boolean;
  meeshoPlatform: boolean;
  // flipkartPlatform: boolean; // Removed
  websitePlatform: boolean;
  dashboard: boolean;
  categories: boolean;
  products: boolean;
  stocks: boolean;
  customers: boolean;
  vendors: boolean;
  salesInvoice: boolean;
  purchaseInvoice: boolean;
  creditDebitNote: boolean;
  expenses: boolean;
  reports: boolean;
  settings: boolean;
  amazonDashboard: boolean;
  orders: boolean;
  catalog: boolean;
  inventory: boolean;
  advertising: boolean;
  amazonVendors: boolean;
  returns: boolean;
  payments: boolean;
  amazonReports: boolean;
  messaging: boolean;
}

export const defaultPermissions: PlatformPermissions = {
  officePlatform: false,
  amazonPlatform: true, // Default to Amazon
  meeshoPlatform: false,
  // flipkartPlatform: false, // Removed
  websitePlatform: false,
  dashboard: false,
  categories: false,
  products: false,
  stocks: false,
  customers: false,
  vendors: false,
  salesInvoice: false,
  purchaseInvoice: false,
  creditDebitNote: false,
  expenses: false,
  reports: false,
  settings: false,
  amazonDashboard: false,
  orders: false,
  catalog: false,
  inventory: false,
  advertising: false,
  amazonVendors: false,
  returns: false,
  payments: false,
  amazonReports: false,
  messaging: false,
};

export interface User {
  _id: string;
  name: string;
  email?: string; // Made email optional
  password?: string; // Keep password optional for editing
  role: string;
  permissions: PlatformPermissions;
  createdAt: string;
}

export type UserPermission = User; // Alias for clarity if needed elsewhere

