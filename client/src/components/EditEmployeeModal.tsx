
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/data/mockEmployees';

interface EditEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateEmployee: (employee: Employee) => void;
  employee: Employee | null;
}

const EditEmployeeModal = ({ isOpen, onClose, onUpdateEmployee, employee }: EditEmployeeModalProps) => {
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

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        position: employee.position,
        department: employee.department,
        phone: employee.phone || '',
        email: employee.email,
        degree: employee.degree || '',
        photo: employee.photo,
        dateOfJoined: (employee as any).dateOfJoined || '',
        salary: (employee as any).salary || '',
        bankAccountNumber: (employee as any).bankAccountNumber || '',
        ifscCode: (employee as any).ifscCode || '',
        aadharNumber: (employee as any).aadharNumber || '',
        workExperience: (employee as any).workExperience || ''
      });
    }
  }, [employee]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.position || !formData.department || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!employee) return;

    const updatedEmployee: Employee = {
      ...employee,
      name: formData.name,
      position: formData.position,
      department: formData.department,
      phone: formData.phone,
      email: formData.email,
      degree: formData.degree,
      photo: formData.photo,
      dateOfJoined: formData.dateOfJoined,
      salary: formData.salary,
      bankAccountNumber: formData.bankAccountNumber,
      ifscCode: formData.ifscCode,
      aadharNumber: formData.aadharNumber,
      workExperience: formData.workExperience
    } as any;

    onUpdateEmployee(updatedEmployee);
    toast.success('Employee updated successfully!');
    onClose();
  };

  if (!employee) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <Edit className="w-6 h-6 text-blue-600" />
            <span>Edit Employee - {employee.id}</span>
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="photo">Employee Photo</Label>
            <div className="flex flex-col items-center space-x-4 space-y-4">
              {formData.photo && (
                <img
                  src={formData.photo}
                  alt="Employee preview"
                  className="w-45 h-45 rounded-full object-cover border-2 border-gray-200"
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
                <p className="text-xs text-gray-500 mt-1">Upload new photo (optional)</p>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="employee@company.com"
              />
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
              <Edit className="w-4 h-4 mr-2" />
              Update Employee
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
