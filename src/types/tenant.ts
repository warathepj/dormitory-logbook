
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
  paymentDueDate: number; // Day of month when payment is due
}

export type TenantFormData = Omit<Tenant, "id" | "createdAt">;
