
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Clock, User, IdCard, MapPin, Calendar } from 'lucide-react';
import { useState } from 'react';

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photo: string;
  email: string;
}

interface EmployeeModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dailyReport?: string) => void;
  isCheckingIn: boolean;
}

const EmployeeModal = ({ employee, isOpen, onClose, onConfirm, isCheckingIn }: EmployeeModalProps) => {
  const [dailyReport, setDailyReport] = useState('');

  if (!employee) return null;

  const getIndianTime = () => {
    return new Date().toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getIndianDate = () => {
    return new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleConfirm = () => {
    if (!isCheckingIn && !dailyReport.trim()) {
      return; // Don't allow checkout without daily report
    }
    onConfirm(isCheckingIn ? undefined : dailyReport);
    setDailyReport(''); // Reset the report after confirmation
  };

  const handleClose = () => {
    setDailyReport(''); // Reset the report when closing
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 -m-6 mb-3">
          <DialogTitle className="text-2xl font-bold text-center text-white mb-2">
            {isCheckingIn ? 'Check In Confirmation' : 'Check Out Confirmation'}
          </DialogTitle>
          <p className="text-blue-100 text-center text-sm">
            Please confirm your attendance action
          </p>
        </div>
        
        <div className="space-y-5 px-2">
          {/* Employee Photo and Status */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  src={employee.photo}
                  alt={employee.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-3 border-white shadow-lg flex items-center justify-center ${
                isCheckingIn ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <Clock className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Employee Details Card */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 space-y-3">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Employee Name</p>
                  <p className="font-bold text-gray-900 text-lg">{employee.name}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <IdCard className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Employee ID</p>
                  <p className="font-bold text-gray-900">{employee.id}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Position</p>
                  <p className="font-bold text-gray-900">{employee.position}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Report for Checkout */}
          {!isCheckingIn && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Daily Work Report</h3>
              <p className="text-sm text-gray-600 mb-3">Please describe your work activities for today:</p>
              <Textarea
                value={dailyReport}
                onChange={(e) => setDailyReport(e.target.value)}
                placeholder="Enter your daily work report here... (Required for checkout)"
                className="min-h-[100px] resize-none border-2 border-yellow-300 focus:border-yellow-500"
                required
              />
              {!dailyReport.trim() && (
                <p className="text-red-500 text-xs mt-2">Daily report is required to check out</p>
              )}
            </div>
          )}

          {/* Date and Time */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 text-center border border-indigo-100">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-6 h-6 text-indigo-600 mr-2" />
              <span className="text-sm font-medium text-indigo-600 uppercase tracking-wide">Current Date & Time</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{getIndianDate()}</p>
            <p className="text-3xl font-bold text-indigo-600">
              {getIndianTime()}
            </p>
            <p className="text-xs text-gray-500 mt-1">India Standard Time</p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-2">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1 h-12 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isCheckingIn && !dailyReport.trim()}
              className={`flex-1 h-12 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all ${
                isCheckingIn 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                  : !dailyReport.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
              }`}
            >
              <Clock className="w-5 h-5 mr-2" />
              Confirm {isCheckingIn ? 'Check In' : 'Check Out'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeModal;
