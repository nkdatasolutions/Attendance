import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LogOut, Users, Clock, TrendingUp, Award, Download, UserPlus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ThreeBackground from '@/components/ThreeBackground';
import AddEmployeeModal from '@/components/AddEmployeeModal';
import EditEmployeeModal from '@/components/EditEmployeeModal';
import { mockEmployees, initialAttendanceRecords, Employee, AttendanceRecord } from '@/data/mockEmployees';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [attendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated');
    if (!isAuthenticated) {
      navigate('/loginadmin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated');
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeModalOpen(true);
  };

  const handleUpdateEmployee = (updatedEmployee: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp));
    setSelectedEmployee(null);
  };

  const handleDeleteEmployee = (employeeId: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
    toast.success('Employee deleted successfully');
  };

  const getAttendanceRecord = (employeeId: string) => {
    return attendanceRecords.find(record => record.employeeId === employeeId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Present</span>;
      case 'checked-out':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Checked Out</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Absent</span>;
    }
  };

  const downloadAttendanceReport = () => {
    const currentDate = new Date().toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let csvContent = `Attendance Report - ${currentDate}\n\n`;
    csvContent += 'Employee ID,Employee Name,Position,Department,Email,Check In Time,Check Out Time,Status\n';

    employees.forEach(employee => {
      const attendance = getAttendanceRecord(employee.id);
      csvContent += `${employee.id},${employee.name},${employee.position},${employee.department},${employee.email},${attendance?.checkInTime || 'N/A'},${attendance?.checkOutTime || 'N/A'},${attendance?.status || 'Absent'}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Attendance report downloaded successfully!');
  };

  const totalEmployees = employees.length;
  const presentEmployees = attendanceRecords.filter(record => record.status === 'present').length;
  const checkedOutEmployees = attendanceRecords.filter(record => record.status === 'checked-out').length;
  const attendanceRate = Math.round(((presentEmployees + checkedOutEmployees) / totalEmployees) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      <ThreeBackground />
      
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Employee Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setIsAddEmployeeModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add Employee
              </Button>
              <Button
                onClick={downloadAttendanceReport}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Report
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 rounded-xl"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-3xl font-bold text-gray-900">{totalEmployees}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Present Today</p>
                    <p className="text-3xl font-bold text-green-600">{presentEmployees}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Checked Out</p>
                    <p className="text-3xl font-bold text-blue-600">{checkedOutEmployees}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border-0 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Attendance Rate</p>
                    <p className="text-3xl font-bold text-purple-600">{attendanceRate}%</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Employee Table */}
          <Card className="bg-white shadow-lg border-0 rounded-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900">Employee Attendance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Check In Time</TableHead>
                    <TableHead>Check Out Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Options</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => {
                    const attendance = getAttendanceRecord(employee.id);
                    return (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <img
                              src={employee.photo}
                              alt={employee.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{employee.name}</p>
                              <p className="text-sm text-gray-500">{employee.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <span className="text-green-600 font-medium">
                            {attendance?.checkInTime || '--:--'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600 font-medium">
                            {attendance?.checkOutTime || '--:--'}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(attendance?.status || 'absent')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditEmployee(employee)}
                              className="p-2"
                            >
                              <Edit className="w-4 h-4 text-blue-600" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline" className="p-2">
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete {employee.name}? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEmployee(employee.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>

        {/* Add Employee Modal */}
        <AddEmployeeModal
          isOpen={isAddEmployeeModalOpen}
          onClose={() => setIsAddEmployeeModalOpen(false)}
          onAddEmployee={handleAddEmployee}
          employees={employees}
        />

        {/* Edit Employee Modal */}
        <EditEmployeeModal
          isOpen={isEditEmployeeModalOpen}
          onClose={() => setIsEditEmployeeModalOpen(false)}
          onUpdateEmployee={handleUpdateEmployee}
          employee={selectedEmployee}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
