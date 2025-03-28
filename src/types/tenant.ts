
export interface Tenant {
  id: string;
  fullName: string;
  contactNumber: string;
  moveInDate: string;
  roomNumber: string;
  createdAt: string;
  // Monthly charges
  baseRent: number;
  electricityFee: number;
  waterFee: number;
  internetFee: number;
  parkingFee: number;
  // Payment details
  paymentDueDate: number; // Fixed at 5
}

export type TenantFormData = Omit<Tenant, "id" | "createdAt" | "paymentDueDate">;
