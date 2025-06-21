
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/data/mockEmployees';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEmployee: (employee: any) => void;
  employees: Employee[];
}

const AddEmployeeModal = ({ isOpen, onClose, onAddEmployee, employees }: AddEmployeeModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    phone: '',
    email: '',
    degree: '',
    photo: '',
    dateOfJoined: '',
    salary: '',
    bankAccountNumber: '',
    ifscCode: '',
    aadharNumber: '',
    workExperience: ''
  });

  const [generatedId, setGeneratedId] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          photo: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmployeeId = () => {
    // Find the highest existing NK number
    const existingNumbers = employees
      .map(emp => emp.id)
      .filter(id => id.startsWith('NK'))
      .map(id => parseInt(id.substring(2)))
      .filter(num => !isNaN(num));
    
    const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
    return `NK${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.department || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    const employeeId = generateEmployeeId();
    setGeneratedId(employeeId);

    const newEmployee = {
      id: employeeId,
      name: formData.name,
      position: formData.position,
      department: formData.department,
      phone: formData.phone,
      email: formData.email || `${formData.name.toLowerCase().replace(' ', '.')}@company.com`,
      degree: formData.degree,
      photo: formData.photo || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
      dateOfJoined: formData.dateOfJoined,
      salary: formData.salary,
      bankAccountNumber: formData.bankAccountNumber,
      ifscCode: formData.ifscCode,
      aadharNumber: formData.aadharNumber,
      workExperience: formData.workExperience
    };

    onAddEmployee(newEmployee);
    toast.success(`Employee added successfully! Employee ID: ${employeeId}`);
    
    // Reset form
    setFormData({
      name: '',
      position: '',
      department: '',
      phone: '',
      email: '',
      degree: '',
      photo: '',
      dateOfJoined: '',
      salary: '',
      bankAccountNumber: '',
      ifscCode: '',
      aadharNumber: '',
      workExperience: ''
    });
    setGeneratedId('');
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <UserPlus className="w-6 h-6 text-blue-600" />
            <span>Add New Employee</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Employee Photo</Label>
            <div className="flex items-center space-x-4">
              {formData.photo && (
                <img
                  src={formData.photo}
                  alt="Employee preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div className="flex-1">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-1">Upload employee photo (optional)</p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                placeholder="e.g., Senior Developer"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                placeholder="e.g., Content Development"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="e.g., +91 9876543210"
                required
              />
            </div>
          </div>

          {/* Contact & Education */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="employee@company.com"
              />
              <p className="text-xs text-gray-500">Leave empty to auto-generate</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="degree">Degree/Qualification</Label>
              <Input
                id="degree"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                placeholder="e.g., B.Tech Computer Science"
              />
            </div>
          </div>

          {/* Personal Documents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="aadharNumber">Aadhar Number</Label>
              <Input
                id="aadharNumber"
                name="aadharNumber"
                value={formData.aadharNumber}
                onChange={handleInputChange}
                placeholder="e.g., 1234 5678 9012"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workExperience">Work Experience</Label>
              <Input
                id="workExperience"
                name="workExperience"
                value={formData.workExperience}
                onChange={handleInputChange}
                placeholder="e.g., 3 years in software development"
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dateOfJoined">Date of Joined</Label>
              <Input
                id="dateOfJoined"
                name="dateOfJoined"
                type="date"
                value={formData.dateOfJoined}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Salary</Label>
              <Input
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                placeholder="e.g., 50000"
              />
            </div>
          </div>

          {/* Banking Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
              <Input
                id="bankAccountNumber"
                name="bankAccountNumber"
                value={formData.bankAccountNumber}
                onChange={handleInputChange}
                placeholder="Enter bank account number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                name="ifscCode"
                value={formData.ifscCode}
                onChange={handleInputChange}
                placeholder="e.g., SBIN0001234"
              />
            </div>
          </div>

          {/* Generated Employee ID Display */}
          {generatedId && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                Employee ID Generated: <span className="font-bold">{generatedId}</span>
              </p>
              <p className="text-xs text-green-600 mt-1">
                Share this ID with the employee for check-in access
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
