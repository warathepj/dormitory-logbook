
import { Tenant } from "../types/tenant";

const STORAGE_KEY = "dormitory_tenants";

export const saveTenants = (tenants: Tenant[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tenants));
};

export const getTenants = (): Tenant[] => {
  const storedData = localStorage.getItem(STORAGE_KEY);
  return storedData ? JSON.parse(storedData) : [];
};

export const addTenant = (tenant: Tenant): void => {
  const tenants = getTenants();
  saveTenants([...tenants, tenant]);
};

export const removeTenant = (id: string): void => {
  const tenants = getTenants();
  saveTenants(tenants.filter(t => t.id !== id));
};

export const updateTenant = (updatedTenant: Tenant): void => {
  const tenants = getTenants();
  saveTenants(tenants.map(t => t.id === updatedTenant.id ? updatedTenant : t));
};
