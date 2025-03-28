
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, User, Phone, Home, DollarSign, Droplets, Zap, Wifi, Car } from "lucide-react";
import { TenantFormData, Tenant } from "@/types/tenant";

interface TenantFormProps {
  onSubmit: (tenant: Tenant) => void;
  initialData?: TenantFormData;
  isEditing?: boolean;
}

const TenantForm = ({ 
  onSubmit, 
  initialData = { 
    fullName: "", 
    contactNumber: "", 
    moveInDate: "", 
    roomNumber: "",
    baseRent: 0,
    electricityFee: 0,
    waterFee: 0,
    internetFee: 0,
    parkingFee: 0
  },
  isEditing = false 
}: TenantFormProps) => {
  const [formData, setFormData] = useState<TenantFormData>(initialData);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Handle numeric fields
    if (['baseRent', 'electricityFee', 'waterFee', 'internetFee', 'parkingFee'].includes(name)) {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value === '' ? 0 : parseFloat(value) 
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.fullName || !formData.contactNumber || !formData.moveInDate || !formData.roomNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Create tenant object with ID and fixed payment due date
    const tenant: Tenant = {
      ...formData,
      id: isEditing ? (initialData as unknown as Tenant).id : crypto.randomUUID(),
      createdAt: isEditing ? (initialData as unknown as Tenant).createdAt : new Date().toISOString(),
      paymentDueDate: 5 // Fixed payment due date
    };

    onSubmit(tenant);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({ 
        fullName: "", 
        contactNumber: "", 
        moveInDate: "", 
        roomNumber: "",
        baseRent: 0,
        electricityFee: 0,
        waterFee: 0,
        internetFee: 0,
        parkingFee: 0
      });
    }

    toast({
      title: isEditing ? "Tenant Updated" : "Tenant Added",
      description: isEditing 
        ? `${formData.fullName}'s information has been updated`
        : `${formData.fullName} has been added to the dormitory records`
    });
  };

  return (
    <form onSubmit={handleSubmit} className="retro-panel space-y-4">
      <div className="retro-header mb-4">
        <h2 className="text-lg">{isEditing ? "Edit Tenant Information" : "New Tenant Registration"}</h2>
      </div>

      <div className="space-y-3">
        {/* Personal Information Fields */}
        <div className="grid gap-2">
          <Label htmlFor="fullName" className="flex items-center gap-2">
            <User size={16} className="text-brown-700" />
            Full Name
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="Enter full name"
            className="retro-input"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contactNumber" className="flex items-center gap-2">
            <Phone size={16} className="text-brown-700" />
            Contact Number
          </Label>
          <Input
            id="contactNumber"
            name="contactNumber"
            placeholder="Enter contact number"
            className="retro-input"
            value={formData.contactNumber}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="moveInDate" className="flex items-center gap-2">
            <Calendar size={16} className="text-brown-700" />
            Move-in Date
          </Label>
          <Input
            id="moveInDate"
            name="moveInDate"
            type="date"
            className="retro-input"
            value={formData.moveInDate}
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="roomNumber" className="flex items-center gap-2">
            <Home size={16} className="text-brown-700" />
            Room Number
          </Label>
          <Input
            id="roomNumber"
            name="roomNumber"
            placeholder="Enter room number"
            className="retro-input"
            value={formData.roomNumber}
            onChange={handleChange}
          />
        </div>

        <div className="mt-5 mb-2 border-t-2 border-brown-200 pt-4">
          <h3 className="text-md font-semibold text-brown-700 mb-3">Monthly Charges</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="baseRent" className="flex items-center gap-2">
                <DollarSign size={16} className="text-brown-700" />
                Base Rent
              </Label>
              <Input
                id="baseRent"
                name="baseRent"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="retro-input"
                value={formData.baseRent}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="electricityFee" className="flex items-center gap-2">
                <Zap size={16} className="text-brown-700" />
                Electricity Fee
              </Label>
              <Input
                id="electricityFee"
                name="electricityFee"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="retro-input"
                value={formData.electricityFee}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="waterFee" className="flex items-center gap-2">
                <Droplets size={16} className="text-brown-700" />
                Water Fee
              </Label>
              <Input
                id="waterFee"
                name="waterFee"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="retro-input"
                value={formData.waterFee}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="internetFee" className="flex items-center gap-2">
                <Wifi size={16} className="text-brown-700" />
                Internet/WiFi Fee
              </Label>
              <Input
                id="internetFee"
                name="internetFee"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="retro-input"
                value={formData.internetFee}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parkingFee" className="flex items-center gap-2">
                <Car size={16} className="text-brown-700" />
                Parking Fee
              </Label>
              <Input
                id="parkingFee"
                name="parkingFee"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className="retro-input"
                value={formData.parkingFee}
                onChange={handleChange}
              />
            </div>
            
            {/* Removed payment due date input since it's now fixed at 5 */}
            <div className="grid gap-2">
              <p className="text-xs text-brown-600">Payment is due on the 5th of each month</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="retro-button">
          {isEditing ? "Update Tenant" : "Register Tenant"}
        </button>
      </div>
    </form>
  );
};

export default TenantForm;
