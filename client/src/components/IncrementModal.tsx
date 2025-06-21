
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { Employee } from '@/data/mockEmployees';

interface IncrementModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

const IncrementModal = ({ isOpen, onClose, employee }: IncrementModalProps) => {
  const [incrementData, setIncrementData] = useState({
    incrementAmount: '',
    effectiveDate: '',
    reason: ''
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!incrementData.incrementAmount || !incrementData.effectiveDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    toast.success(`Increment processed for ${employee.name}!`);
    
    // Reset form
    setIncrementData({
      incrementAmount: '',
      effectiveDate: '',
      reason: ''
    });
    
    onClose();
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
            <Label htmlFor="incrementAmount">Increment Amount (%) *</Label>
            <Input
              id="incrementAmount"
              name="incrementAmount"
              value={incrementData.incrementAmount}
              onChange={handleInputChange}
              placeholder="e.g., 10"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="effectiveDate">Effective Date *</Label>
            <Input
              id="effectiveDate"
              name="effectiveDate"
              type="date"
              value={incrementData.effectiveDate}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason (Optional)</Label>
            <Input
              id="reason"
              name="reason"
              value={incrementData.reason}
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
