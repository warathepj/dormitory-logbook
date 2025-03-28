
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, User, Phone, Home } from "lucide-react";
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
    roomNumber: "" 
  },
  isEditing = false 
}: TenantFormProps) => {
  const [formData, setFormData] = useState<TenantFormData>(initialData);
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Create tenant object with ID
    const tenant: Tenant = {
      ...formData,
      id: isEditing ? (initialData as unknown as Tenant).id : crypto.randomUUID(),
      createdAt: isEditing ? (initialData as unknown as Tenant).createdAt : new Date().toISOString()
    };

    onSubmit(tenant);
    
    // Reset form if not editing
    if (!isEditing) {
      setFormData({ 
        fullName: "", 
        contactNumber: "", 
        moveInDate: "", 
        roomNumber: "" 
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
