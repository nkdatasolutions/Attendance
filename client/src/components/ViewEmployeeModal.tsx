
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, User, Mail, Phone, Calendar, DollarSign, CreditCard, TrendingUp, Briefcase, GraduationCap, Building, FileText, Hash } from 'lucide-react';
import { Employee } from '@/data/mockEmployees';
import IncrementModal from './IncrementModal';

interface AttendanceRecord {
  employeeId: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'absent' | 'checked-out';
  date: string;
}

interface ViewEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  attendanceRecords: AttendanceRecord[];
}

const ViewEmployeeModal = ({ isOpen, onClose, employee, attendanceRecords }: ViewEmployeeModalProps) => {
  const [isIncrementModalOpen, setIsIncrementModalOpen] = useState(false);

  if (!employee) return null;

  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getTodayAttendance = () => {
    const todayDate = getTodayDateString();
    return attendanceRecords.find(record => 
      record.employeeId === employee.id && record.date === todayDate
    );
  };

  const todayAttendance = getTodayAttendance();
  const extendedEmployee = employee as any;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-xl">
              <Eye className="w-6 h-6 text-blue-600" />
              <span>Employee Details - {employee.id}</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Employee Photo and Basic Info */}
            <div className="flex items-center space-x-6 p-4 bg-gray-50 rounded-lg">
              <img
                src={employee.photo}
                alt={employee.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
                <p className="text-lg text-blue-600 font-semibold">{employee.position}</p>
                <p className="text-gray-600 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  {employee.department}
                </p>
              </div>
              <div className="ml-auto">
                <Button
                  onClick={() => setIsIncrementModalOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Process Increment
                </Button>
              </div>
            </div>

            {/* Today's Attendance */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Today's Attendance
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Check In Time</p>
                  <p className="font-semibold text-green-600">
                    {todayAttendance?.checkInTime || 'Not checked in'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    todayAttendance?.status === 'present' ? 'bg-green-100 text-green-800' :
                    todayAttendance?.status === 'checked-out' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {todayAttendance?.status === 'present' ? 'Present' :
                     todayAttendance?.status === 'checked-out' ? 'Checked Out' : 'Absent'}
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{employee.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{employee.phone || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Degree</p>
                    <p className="font-medium">{employee.degree || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Hash className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Aadhar Number</p>
                    <p className="font-medium">{extendedEmployee.aadharNumber || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date of Joined</p>
                    <p className="font-medium">{extendedEmployee.dateOfJoined || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Salary</p>
                    <p className="font-medium">{extendedEmployee.salary ? `₹${extendedEmployee.salary}` : 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <CreditCard className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Bank Account</p>
                    <p className="font-medium">{extendedEmployee.bankAccountNumber || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">IFSC Code</p>
                    <p className="font-medium">{extendedEmployee.ifscCode || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Work Experience</p>
                    <p className="font-medium">{extendedEmployee.workExperience || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                onClick={onClose}
                className="px-6 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Increment Modal */}
      <IncrementModal
        isOpen={isIncrementModalOpen}
        onClose={() => setIsIncrementModalOpen(false)}
        employee={employee}
      />
    </>
  );
};

export default ViewEmployeeModal;
