
import { useState, useEffect } from "react";
import TenantForm from "@/components/TenantForm";
import TenantList from "@/components/TenantList";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Tenant } from "@/types/tenant";
import { addTenant, getTenants, removeTenant, updateTenant } from "@/utils/storage";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [tenantToDelete, setTenantToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Load tenants from local storage on component mount
  useEffect(() => {
    setTenants(getTenants());
  }, []);

  const handleAddTenant = (tenant: Tenant) => {
    addTenant(tenant);
    setTenants(getTenants());
  };

  const handleUpdateTenant = (tenant: Tenant) => {
    updateTenant(tenant);
    setTenants(getTenants());
    setEditingTenant(null);
  };

  const handleEditClick = (tenant: Tenant) => {
    setEditingTenant(tenant);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (id: string) => {
    setTenantToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (tenantToDelete) {
      removeTenant(tenantToDelete);
      setTenants(getTenants());
      setIsDeleteDialogOpen(false);
      setTenantToDelete(null);
      
      toast({
        title: "Tenant Removed",
        description: "The tenant has been removed from the records",
      });
    }
  };

  const cancelEdit = () => {
    setEditingTenant(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 md:px-8">
      <header className="mb-8 text-center">
        <div className="inline-block bg-gradient-to-r from-brown-600 to-brown-800 p-4 rounded-lg shadow-lg mb-2">
          <h1 className="text-3xl font-bold text-tan-100">Dormitory Rental Records</h1>
        </div>
        <p className="text-brown-700 italic">Managing student housing since 2000</p>
      </header>

      <div className="max-w-5xl mx-auto">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-1">
            {editingTenant ? (
              <div className="space-y-4">
                <TenantForm 
                  onSubmit={handleUpdateTenant} 
                  initialData={editingTenant}
                  isEditing={true}
                />
                <button 
                  onClick={cancelEdit}
                  className="w-full py-2 bg-tan-200 text-brown-700 border-2 border-brown-300 rounded-md hover:bg-tan-300"
                >
                  Cancel Editing
                </button>
              </div>
            ) : (
              <TenantForm onSubmit={handleAddTenant} />
            )}
          </div>
          
          <div className="lg:col-span-2">
            <TenantList 
              tenants={tenants} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteClick} 
            />
          </div>
        </div>
      </div>

      <footer className="mt-12 text-center text-brown-500 text-sm">
        <p>© 2000-2023 Dormitory Management System</p>
      </footer>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        description="Are you sure you want to remove this tenant from the records? This action cannot be undone."
      />
    </div>
  );
};

export default Index;
