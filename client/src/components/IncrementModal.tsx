
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/data/mockEmployees';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface IncrementModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const IncrementModal = ({ isOpen, onClose, employee }: IncrementModalProps) => {
  const [incrementData, setIncrementData] = useState({
    incrementAmt: '',
    incrementDate: '',
    increason: ''
  });

  if (!employee) return null;

  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long'
    });
  };

  const getWorkingDays = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const workingDays = [];

    for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude weekends
        workingDays.push(d.getDate());
      }
    }

    return `${workingDays.length} working days`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setIncrementData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!incrementData.incrementAmt || !incrementData.incrementDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const payload = {
        incrementAmt: incrementData.incrementAmt,
        incrementDate: incrementData.incrementDate,
        increason: incrementData.increason,
      };

      const response = await axios.put(`${API_URL}/admin/employee-update/${employee.id}`, payload);

      if (response.status === 200 || response.status === 204) {
        toast.success(`Increment processed for ${employee.name}!`);
        // Reset form
        setIncrementData({
          incrementAmt: '',
          incrementDate: '',
          increason: '',
        });
        onClose();
      } else {
        toast.error('Failed to update employee increment. Please try again.');
      }
    } catch (error: any) {
      console.error(error);
      if (axios.isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Server error occurred.');
      } else {
        toast.error('Network error or unexpected error occurred.');
      }
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <span>Process Increment</span>
          </DialogTitle>
        </DialogHeader>

        {/* Employee Info */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3 mb-2">
            <User className="w-5 h-5 text-blue-600" />
            <div>
              <p className="font-semibold text-gray-900">{employee.name}</p>
              <p className="text-sm text-gray-600">ID: {employee.id}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium">{getCurrentMonth()}</p>
              <p className="text-xs text-gray-600">{getWorkingDays()}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="incrementAmt">Increment Amount (₹) *</Label>
            <Input
              id="incrementAmt"
              name="incrementAmt"
              value={incrementData.incrementAmt}
              onChange={handleInputChange}
              placeholder="e.g., 10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="incrementDate">Effective Date *</Label>
            <Input
              id="incrementDate"
              name="incrementDate"
              type="date"
              value={incrementData.incrementDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="increason">Reason (Optional)</Label>
            <Input
              id="increason"
              name="increason"
              value={incrementData.increason}
              onChange={handleInputChange}
              placeholder="Performance, promotion, etc."
            />
          </div>

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
              className="px-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Process Increment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default IncrementModal;
