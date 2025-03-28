
import { useState } from "react";
import { Tenant } from "@/types/tenant";
import { Input } from "@/components/ui/input";
import { Search, Edit, Trash2, DollarSign, FileText, Bell } from "lucide-react";
import { format } from "date-fns";
import TenantDetails from "./TenantDetails";
import { toast } from "@/components/ui/use-toast";

interface TenantListProps {
  tenants: Tenant[];
  onEdit: (tenant: Tenant) => void;
  onDelete: (id: string) => void;
}

const getDueDate = () => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Create due date based on the fixed payment due day (5)
  const dueDate = new Date(currentYear, currentMonth, 5);
  
  // If the due date has already passed this month, show next month
  if (dueDate < currentDate) {
    dueDate.setMonth(dueDate.getMonth() + 1);
  }
  
  return format(dueDate, "MMMM d, yyyy");
};

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

  const simulateNotification = async (type: string, tenant: Tenant) => {
    try {
      // Prepare the notification data with all monthly charges
      const notificationData = {
        id: tenant.id,
        name: tenant.fullName,
        room: tenant.roomNumber,
        contact: tenant.contactNumber,
        moveInDate: tenant.moveInDate,
        charges: {
          baseRent: tenant.baseRent,
          electricityFee: tenant.electricityFee,
          waterFee: tenant.waterFee,
          internetFee: tenant.internetFee,
          parkingFee: tenant.parkingFee,
          total: calculateTotal(tenant)
        },
        monthlyCharges: [
          { type: 'Base Rent', amount: tenant.baseRent },
          { type: 'Electricity', amount: tenant.electricityFee },
          { type: 'Water', amount: tenant.waterFee },
          { type: 'Internet', amount: tenant.internetFee },
          { type: 'Parking', amount: tenant.parkingFee }
        ],
        paymentDueDate: getDueDate(),
        notificationType: type
      };

      // Send data to backend
      const response = await fetch('http://localhost:3000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData)
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const result = await response.json();

      // Show success toast
      const message = `IMPORTANT: Total payment of ${formatCurrency(calculateTotal(tenant))} is due on ${getDueDate()}`;
      toast({
        title: "Payment Reminder",
        description: (
          <div className="space-y-4">
            <p>{message}</p>
            {result.qrCodeUrl && (
              <div className="bg-white p-4 rounded-lg">
                <img 
                  src={result.qrCodeUrl} 
                  alt="Payment QR Code"
                  className="mx-auto w-32 h-32"
                />
                {result.paymentData && (
                  <div className="mt-2 text-sm text-brown-700 space-y-1">
                    <p>Payment Method: {result.paymentData.paymentMethod}</p>
                    <p>Reference: {result.paymentData.reference}</p>
                    <p>Expires in: {result.paymentData.expiresIn} hours</p>
                    <p className="font-mono text-xs">Merchant: {result.paymentData.merchantCode}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ),
        duration: 10000,
      });

    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification to server",
        variant: "destructive"
      });
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
                <th>Notifications</th>
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
                    <td className="text-center">
                      <button
                        onClick={() => simulateNotification('TOTAL', tenant)}
                        className="flex items-center gap-1 px-2 py-1 text-sm text-brown-600 hover:text-brown-800 hover:bg-tan-200 rounded-md border border-brown-300"
                      >
                        <Bell size={14} />
                        Simulate notification
                      </button>
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
                            <div className="font-medium text-brown-800">Internet</div>
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
