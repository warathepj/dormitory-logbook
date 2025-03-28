
import { useState } from "react";
import { Tenant } from "@/types/tenant";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, DollarSign, FileText } from "lucide-react";
import { format } from "date-fns";
import TenantDetails from "./TenantDetails";

interface TenantListProps {
  tenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
}

const TenantList = ({ tenants, onEdit, onDelete }: TenantListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCharges, setShowCharges] = useState<Record<string, boolean>>({});
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);

  const filteredTenants = tenants.filter(tenant => 
    tenant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateTotal = (tenant: Tenant) => {
    return tenant.baseRent + 
           tenant.electricityFee + 
           tenant.waterFee + 
           tenant.internetFee + 
           tenant.parkingFee;
  };

  const toggleCharges = (id: string) => {
    setShowCharges(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const openTenantDetails = (tenant: Tenant) => {
    setSelectedTenant(tenant);
  };

  const closeTenantDetails = () => {
    setSelectedTenant(null);
  };

  return (
    <div className="retro-panel">
      <div className="retro-header mb-4">
        <h2 className="text-lg">Dormitory Tenants</h2>
      </div>

      <div className="mb-4 flex items-center gap-2 bg-tan-100 rounded-md p-2 border-2 border-brown-200">
        <Search size={18} className="text-brown-700" />
        <Input
          placeholder="Search by name or room number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-brown-900"
        />
      </div>

      {selectedTenant ? (
        <div className="space-y-4">
          <TenantDetails tenant={selectedTenant} />
          <button 
            onClick={closeTenantDetails}
            className="w-full py-2 bg-tan-200 text-brown-700 border-2 border-brown-300 rounded-md hover:bg-tan-300"
          >
            Back to Tenant List
          </button>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-8 text-brown-500 bg-tan-100 rounded-md border-2 border-brown-200">
          {tenants.length === 0 
            ? "No tenants registered yet" 
            : "No tenants match your search criteria"}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="retro-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Room</th>
                <th>Contact</th>
                <th>Move-in Date</th>
                <th>Monthly Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <>
                  <tr key={tenant.id}>
                    <td className="font-medium">{tenant.fullName}</td>
                    <td>{tenant.roomNumber}</td>
                    <td>{tenant.contactNumber}</td>
                    <td>{formatDate(tenant.moveInDate)}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        {formatCurrency(calculateTotal(tenant))}
                        <button 
                          onClick={() => toggleCharges(tenant.id)}
                          className="inline-flex items-center justify-center p-1 rounded-sm text-brown-600 hover:text-brown-800 hover:bg-tan-200"
                          aria-label="Toggle charges details"
                        >
                          <DollarSign size={16} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openTenantDetails(tenant)}
                          className="p-1 text-brown-600 hover:text-brown-800"
                          aria-label="View tenant details"
                        >
                          <FileText size={18} />
                        </button>
                        <button
                          onClick={() => onEdit(tenant)}
                          className="p-1 text-brown-600 hover:text-brown-800"
                          aria-label="Edit tenant"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(tenant.id)}
                          className="p-1 text-brown-600 hover:text-red-600"
                          aria-label="Delete tenant"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {showCharges[tenant.id] && (
                    <tr className="bg-tan-100/50">
                      <td colSpan={6} className="py-2 px-4">
                        <div className="grid grid-cols-5 gap-2 text-sm">
                          <div className="space-y-1">
                            <div className="font-medium text-brown-800">Base Rent</div>
                            <div>{formatCurrency(tenant.baseRent)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-brown-800">Electricity</div>
                            <div>{formatCurrency(tenant.electricityFee)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-brown-800">Water</div>
                            <div>{formatCurrency(tenant.waterFee)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-brown-800">Internet/WiFi</div>
                            <div>{formatCurrency(tenant.internetFee)}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="font-medium text-brown-800">Parking</div>
                            <div>{formatCurrency(tenant.parkingFee)}</div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantList;
