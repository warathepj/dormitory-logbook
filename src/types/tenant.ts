
export interface Tenant {
  id: string;
  fullName: string;
  contactNumber: string;
  moveInDate: string;
  roomNumber: string;
  createdAt: string;
}

export type TenantFormData = Omit<Tenant, "id" | "createdAt">;
