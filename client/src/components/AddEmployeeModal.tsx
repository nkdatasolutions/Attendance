
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/data/mockEmployees';
import axios from 'axios';

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
        accountno: '',
        email: '',
        phone: '',
        degree: '',
        salary: '',
        // incrementAmt: '',
        // incrementDate: '',
        aadhar: '',
        ifsc: '',
        joiningdate: '',
        experience: '',
        photo: null, // for file upload
        photoPreview: null, // for preview
    });

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePhotoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setFormData(prev => ({
                ...prev,
                photo: file,
                photoPreview: previewUrl,
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== "photoPreview" && formData[key]) {
                data.append(key, formData[key]);
            }
        });

        try {
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/admin/employee-add`,
                data,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Success:', response.data);
            alert("Employee added successfully!");
            onClose();
        } catch (error) {
            // Get specific error message from backend response
            const message =
                error?.response?.data?.error || // if backend sends { error: "..." }
                error?.response?.data?.message || // or { message: "..." }
                error?.message || // axios-level error
                "Unknown error occurred";

            alert(`Error posting employee:\n${message}`);
            console.error("Detailed error:", error);
        }
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

                        {/* Photo Upload */}
                        <div className="space-y-2">
                            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
                                Employee Photo
                            </label>
                            <div className="flex items-center space-x-4">
                                {formData.photoPreview && (
                                    <img
                                        src={formData.photoPreview}
                                        alt="Employee preview"
                                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                                    />
                                )}
                                <div className="flex-1">
                                    <input
                                        id="photo"
                                        name="photo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoUpload}
                                        className="cursor-pointer border border-gray-300 rounded-md px-2 py-1"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Upload employee photo (optional)
                                    </p>
                                </div>
                            </div>
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
                            <Label htmlFor="aadhar">Aadhar Number</Label>
                            <Input
                                id="aadhar"
                                name="aadhar"
                                value={formData.aadhar}
                                onChange={handleInputChange}
                                placeholder="e.g., 1234 5678 9012"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="experience">Work Experience</Label>
                            <Input
                                id="experience"
                                name="experience"
                                value={formData.experience}
                                onChange={handleInputChange}
                                placeholder="e.g., 3 years in software development"
                            />
                        </div>
                    </div>

                    {/* Employment Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="joiningdate">Date of Joined</Label>
                            <Input
                                id="joiningdate"
                                name="joiningdate"
                                type="date"
                                value={formData.joiningdate}
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
                                type='number'
                                onWheel={(e) => e.target.blur()}
                                placeholder="e.g., 50000"
                            />
                        </div>
                    </div>

                    {/* Employment Details
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="incrementDate">Date of Increment</Label>
                            <Input
                                id="incrementDate"
                                name="incrementDate"
                                type="date"
                                value={formData.incrementDate}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="incrementAmt">Increment Amount</Label>
                            <Input
                                id="incrementAmt"
                                name="incrementAmt"
                                value={formData.incrementAmt}
                                onChange={handleInputChange}
                                placeholder="e.g., 50000"
                            />
                        </div>
                    </div> */}

                    {/* Banking Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="accountno">Bank Account Number</Label>
                            <Input
                                id="accountno"
                                name="accountno"
                                value={formData.accountno}
                                onChange={handleInputChange}
                                placeholder="Enter bank account number"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="ifsc">IFSC Code</Label>
                            <Input
                                id="ifsc"
                                name="ifsc"
                                value={formData.ifsc}
                                onChange={handleInputChange}
                                placeholder="e.g., SBIN0001234"
                            />
                        </div>
                    </div>

                    {/* Generated Employee ID Display */}
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
