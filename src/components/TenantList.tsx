
import { useState } from "react";
import { Tenant } from "@/types/tenant";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface TenantListProps {
  tenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
}

const TenantList = ({ tenants, onEdit, onDelete }: TenantListProps) => {
  const [searchTerm, setSearchTerm] = useState("");

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

      {filteredTenants.length === 0 ? (
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="font-medium">{tenant.fullName}</td>
                  <td>{tenant.roomNumber}</td>
                  <td>{tenant.contactNumber}</td>
                  <td>{formatDate(tenant.moveInDate)}</td>
                  <td>
                    <div className="flex space-x-2">
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
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantList;
