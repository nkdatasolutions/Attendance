
import { Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface AttendanceRecord {
  employeeId: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'absent' | 'checked-out';
  date: string;
}

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  photo: string;
  email: string;
}

interface EmployeeListProps {
  employees: Employee[];
  attendanceRecords: AttendanceRecord[];
  onCheckOut: (employeeId: string) => void;
}

const EmployeeList = ({ employees, attendanceRecords, onCheckOut }: EmployeeListProps) => {
  const getTodayDateString = () => {
    return new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const getAttendanceRecord = (employeeId: string) => {
    const todayDate = getTodayDateString();
    return attendanceRecords.find(record => 
      record.employeeId === employeeId && record.date === todayDate
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'text-green-600 bg-green-100';
      case 'checked-out': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6 mx-auto ">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2 mt-4">Today's Attendance</h2>
        <p className="text-gray-600">Real-time employee presence tracking</p>
      </div>

      <div className="grid gap-4">
        {employees.map((employee) => {
          const attendance = getAttendanceRecord(employee.id);
          const isPresent = attendance?.status === 'present';
          const isCheckedOut = attendance?.status === 'checked-out';

          return (
            <Card key={employee.id} className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 gap-8 justify-between">
                  {/* Employee Info */}
                  <div className="flex items-center gap-2 space-x-4">
                    <div className="relative">
                      <img
                        src={employee.photo}
                        alt={employee.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-md"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        isPresent ? 'bg-green-500' : isCheckedOut ? 'bg-blue-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-lg">{employee.name}</h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <User className="w-4 h-4 mr-1" />
                        {employee.position}
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 mr-1" />
                        {employee.department}
                      </div>
                    </div>
                  </div>

                  {/* Attendance Info */}
                  <div className="flex items-center space-x-8">
                    {/* Check In Time */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Check In</p>
                      <p className="font-bold text-green-600 text-lg">
                        {attendance?.checkInTime || '--:--'}
                      </p>
                    </div>

                    {/* Check Out Time */}
                    <div className="text-center">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Check Out</p>
                      <p className="font-bold text-blue-600 text-lg">
                        {attendance?.checkOutTime || '--:--'}
                      </p>
                    </div>

                    {/* Status and Action */}
                    <div className="flex flex-col items-center space-y-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        getStatusColor(attendance?.status || 'absent')
                      }`}>
                        {attendance?.status === 'present' ? 'Present' : 
                         attendance?.status === 'checked-out' ? 'Checked Out' : 'Absent'}
                      </span>
                      
                      {isPresent && (
                        <Button
                          onClick={() => onCheckOut(employee.id)}
                          size="sm"
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-xl"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Check Out
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeList;
