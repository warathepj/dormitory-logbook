
import { Tenant } from "@/types/tenant";
import { format } from "date-fns";
import { 
  Calendar, 
  Home, 
  Phone, 
  CalendarClock, 
  DollarSign, 
  FileSignature 
} from "lucide-react";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TenantDetailsProps {
  tenant: Tenant;
}

const TenantDetails = ({ tenant }: TenantDetailsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  const calculateTotal = () => {
    return tenant.baseRent + 
           tenant.electricityFee + 
           tenant.waterFee + 
           tenant.internetFee + 
           tenant.parkingFee;
  };

  const getDueDate = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Create due date based on the payment due day
    const dueDate = new Date(currentYear, currentMonth, tenant.paymentDueDate);
    
    // If the due date has already passed this month, show next month
    if (dueDate < currentDate) {
      dueDate.setMonth(dueDate.getMonth() + 1);
    }
    
    return format(dueDate, "MMMM d, yyyy");
  };

  return (
    <div className="retro-panel space-y-6">
      <div className="retro-header">
        <h2 className="text-lg">Tenant Payment Record</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-brown-700 font-semibold">Tenant Information</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">Name:</span>
              <span>{tenant.fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-brown-700" />
              <span>{tenant.contactNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Home size={14} className="text-brown-700" />
              <span>Room {tenant.roomNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-brown-700" />
              <span>Move-in: {formatDate(tenant.moveInDate)}</span>
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-brown-700 font-semibold">Payment Details</p>
            <div className="flex items-center gap-2">
              <CalendarClock size={14} className="text-brown-700" />
              <span>Due Date: {getDueDate()}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-brown-700" />
              <span>Monthly Total: {formatCurrency(calculateTotal())}</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-md border-2 border-brown-300">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Base Rent</TableCell>
                <TableCell className="text-right">{formatCurrency(tenant.baseRent)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Electricity</TableCell>
                <TableCell className="text-right">{formatCurrency(tenant.electricityFee)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Water</TableCell>
                <TableCell className="text-right">{formatCurrency(tenant.waterFee)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Internet/WiFi</TableCell>
                <TableCell className="text-right">{formatCurrency(tenant.internetFee)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Parking</TableCell>
                <TableCell className="text-right">{formatCurrency(tenant.parkingFee)}</TableCell>
              </TableRow>
              <TableRow className="bg-brown-100/50">
                <TableCell className="font-bold">TOTAL</TableCell>
                <TableCell className="text-right font-bold">{formatCurrency(calculateTotal())}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <FileSignature size={18} className="text-brown-700" />
              <p className="font-medium text-brown-800">Tenant Signature</p>
            </div>
            <div className="border-b-2 border-dashed border-brown-300 h-10"></div>
            <p className="text-sm text-brown-600">Date: ___________________</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <FileSignature size={18} className="text-brown-700" />
              <p className="font-medium text-brown-800">Management Signature</p>
            </div>
            <div className="border-b-2 border-dashed border-brown-300 h-10"></div>
            <p className="text-sm text-brown-600">Date: ___________________</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetails;
