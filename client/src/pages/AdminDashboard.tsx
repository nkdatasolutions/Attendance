
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { LogOut, Users, Clock, TrendingUp, Award, Download, UserPlus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import ThreeBackground from '@/components/ThreeBackground';
import AddEmployeeModal from '@/components/AddEmployeeModal';
import EditEmployeeModal from '@/components/EditEmployeeModal';
import ViewEmployeeModal from '@/components/ViewEmployeeModal';
import axios from 'axios';
import { utils, writeFile } from 'xlsx';
import { saveAs } from 'file-saver';
// import axios from 'axios';

// Updated AttendanceRecord interface to include dailyReport


interface Employee {
    id: string;
    name: string;
    position: string;
    department: string;
    email: string;
    photo: string;
}

interface AttendanceRecord {
    id: string;
    date: string;
    prodsts: string;
    checkin: boolean;
    checkintime: string | null;
    checkout: boolean;
    checkouttime: string | null;
    absent: boolean;
}

const AdminDashboard = () => {
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL;

    const [attendanceRecords] = useState<AttendanceRecord[]>([]);
    // const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
    const [isEditEmployeeModalOpen, setIsEditEmployeeModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isViewEmployeeModalOpen, setIsViewEmployeeModalOpen] = useState(false);
    const [viewingEmployee, setViewingEmployee] = useState<Employee | null>(null);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [seqFormOpen, setSeqFormOpen] = useState(false);
    const [currentSeq, setCurrentSeq] = useState(null);
    const [newSeq, setNewSeq] = useState('');

    function handleSeqFormOpen() {
        setSeqFormOpen(!seqFormOpen);
    };
    // Load current seq from backend
    useEffect(() => {
        const fetchSeq = async () => {
            try {
                const res = await axios.get(`${API_URL}/public/counter/get`); // adjust URL
                if (res.data.length > 0) {
                    setCurrentSeq(res.data[0].seq); // assuming one counter
                }
            } catch (err) {
                console.error('Failed to fetch sequence:', err);
            }
        };
        fetchSeq();
    }, [seqFormOpen]); // reload when form opens

    const handleUpdateSeq = async () => {
        try {
            const res = await axios.put(`${API_URL}/public/counter/update/${currentSeq}`, {
                newSeq: parseInt(newSeq),
            });
            setCurrentSeq(res.data.seq);
            setSeqFormOpen(false);
        } catch (err) {
            console.error('Failed to update sequence:', err);
        }
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${API_URL}/admin/employee`);
                setEmployees(response.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching deposits');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, [API_URL]);

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch attendance data
                const attendanceResponse = await fetch(`${API_URL}/employee/attendance-dateall/${getTodayDateString()}`);
                if (!attendanceResponse.ok) {
                    throw new Error('Failed to fetch attendance data');
                }
                const attendanceJson = await attendanceResponse.json();
                const attendanceArray = Array.isArray(attendanceJson) ? attendanceJson : [attendanceJson];

                setAttendanceData(attendanceArray);
                // console.log('Attendance Data:', attendanceArray);
                // Extract employee IDs from attendance data
                const employeeIds = Array.isArray(attendanceJson)
                    ? attendanceJson.map(item => item.id)
                    : [attendanceJson.id];

                // Fetch employee data for all employees in attendance
                const employeePromises = employeeIds.map(id =>
                    fetch(`${API_URL}/admin/employee/${id}`).then(res => res.json())
                );
                const employees = await Promise.all(employeePromises);
                setEmployeeData(employees);
                // console.log('Employee Data:', employees);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatus = (attendance: AttendanceRecord | undefined) => {
        if (!attendance) return 'absent';
        if (attendance.absent) return 'absent';
        if (attendance.checkout) return 'checked-out';
        if (attendance.checkin) return 'present';
        return 'absent';
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return '--:--';
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    const handleAddEmployee = async (newEmployeeData: FormData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/employee-add`, {
                method: 'POST',
                body: newEmployeeData,
            });

            if (!response.ok) throw new Error('Failed to add employee');
            const newEmployee = await response.json();
            setEmployees(prev => [...prev, newEmployee]);
            toast.success('Employee added successfully');
        } catch (error) {
            // console.error(error);
            toast.error('Error adding employee');
        }
    };

    const handleUpdateEmployee = async (updatedEmployeeData: Partial<Employee> & { photo?: File }) => {
        try {
            const formData = new FormData();
            for (const key in updatedEmployeeData) {
                if (updatedEmployeeData[key as keyof typeof updatedEmployeeData]) {
                    formData.append(key, updatedEmployeeData[key as keyof typeof updatedEmployeeData] as any);
                }
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/employee-update/${updatedEmployeeData.id}`, {
                method: 'PUT',
                body: formData,
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorMessage = `Server error (${response.status})`;

                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    errorMessage = errorData?.error || errorMessage;
                } else {
                    const rawText = await response.text(); // Handle unexpected HTML or text
                    // console.error("Unexpected HTML response:", rawText);
                }

                throw new Error(errorMessage);
            }

            const updated = await response.json();
            setEmployees(prev => prev.map(emp => emp.id === updated.id ? updated : emp));
            toast.success('✅ Employee updated successfully');
            alert('✅ Employee updated successfully');

        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            toast.error(`❌ Error updating employee: ${message}`);
            alert(`❌ Error updating employee: ${message}`);
            // console.error("Update failed:", error);
        }
    };



    const handleDeleteEmployee = async (employeeId: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/employee-drop/${employeeId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete employee');

            setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
            toast.success('Employee deleted successfully');
        } catch (error) {
            // console.error(error);
            toast.error('Error deleting employee');
        }
    };


    useEffect(() => {
        const isAuthenticated = localStorage.getItem('token');
        if (!isAuthenticated) {
            navigate('/loginadmin');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/');
    };

    const handleEditEmployee = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsEditEmployeeModalOpen(true);
    };

    const handleViewEmployee = (employee: Employee) => {
        setViewingEmployee(employee);
        setIsViewEmployeeModalOpen(true);
    };

    const getAttendanceRecord = (id: string) => {
        return attendanceData.find(record => record.id === id);
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

        const data = [
            [`Attendance Report - ${currentDate}`],
            [],
            ["Employee ID", "Employee Name", "Position", "Email", "Check In Time", "Check Out Time", "Status", "Report"]
        ];

        employees.forEach(employee => {
            const attendance = getAttendanceRecord(employee.id);
            const status = attendance?.absent === true ? "❌ Absent" : "✅ Present";

            data.push([
                employee.id,
                employee.name,
                employee.position,
                employee.email,
                formatTime(attendance?.checkintime) || 'N/A',
                formatTime(attendance?.checkouttime) || 'N/A',
                status,
                attendance?.prodsts || 'N/A'
            ]);
        });

        const ws = utils.aoa_to_sheet(data);

        // Set column widths
        ws['!cols'] = [
            { wch: 15 }, { wch: 20 }, { wch: 20 },
            { wch: 25 }, { wch: 25 }, { wch: 25 },
            { wch: 15 }, { wch: 25 }
        ];

        // Merge title
        ws['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

        // Style title cell
        const titleCell = ws["A1"];
        if (titleCell) {
            titleCell.s = {
                font: {
                    name: 'Calibri',
                    sz: 16,
                    bold: true,
                    color: { rgb: "1F2937" }
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center"
                }
            };
        }

        // Header styling
        const headerRow = 3;
        const headers = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        headers.forEach(col => {
            const cell = ws[`${col}${headerRow}`];
            if (cell) {
                cell.s = {
                    font: {
                        name: 'Calibri',
                        bold: true,
                        sz: 12,
                        color: { rgb: "FFFFFF" }
                    },
                    alignment: {
                        vertical: "center",
                        horizontal: "center"
                    },
                    fill: {
                        fgColor: { rgb: "4F46E5" } // Indigo
                    }
                };
            }
        });

        // Data row styling
        for (let i = 4; i < data.length + 3; i++) {
            const statusCol = `G${i}`;
            const rowColor = i % 2 === 0 ? "F9FAFB" : "FFFFFF"; // Light gray stripe

            headers.forEach((col, index) => {
                const cell = ws[`${col}${i}`];
                if (cell) {
                    // Apply common cell styles
                    cell.s = {
                        font: {
                            name: 'Calibri',
                            sz: 11,
                            color: { rgb: "111827" }
                        },
                        alignment: {
                            vertical: "center",
                            horizontal: "center"
                        },
                        fill: {
                            fgColor: { rgb: rowColor }
                        }
                    };

                    // Special status coloring
                    if (col === 'G' && typeof cell.v === 'string') {
                        if (cell.v.includes("Absent")) {
                            cell.s.fill.fgColor.rgb = "FECACA"; // red-200
                        } else if (cell.v.includes("Present")) {
                            cell.s.fill.fgColor.rgb = "D1FAE5"; // green-200
                        }
                    }

                }
            });
        }

        const wb = utils.book_new();
        utils.book_append_sheet(wb, ws, "Attendance Report");

        writeFile(wb, `attendance_report_${new Date().toISOString().split('T')[0]}.xlsx`);

        toast.success('🎉 Attendance report downloaded successfully!', {
            description: 'Check your downloads folder.',
            duration: 3000,
        });
    };


    const totalEmployees = employees.length;
    const presentEmployees = attendanceData.filter(record => record?.checkin === true).length;
    const checkedOutEmployees = attendanceData.filter(record => record?.checkout === true).length;
    const attendanceRate = Math.round(((presentEmployees) / totalEmployees) * 100);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
            <ThreeBackground />

            <div className="relative z-10">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900"><Link to="/">Admin Dashboard</Link></h1>
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
                            <button className='bg-gradient-to-r from-pink-200 to-purple-200 hover:from-pink-300 hover:to-purple-300 text-balck px-4 py-1 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ' onClick={handleSeqFormOpen}>{currentSeq !== null ? currentSeq.toString().padStart(2, '0') : '...'}</button>
                            {seqFormOpen && (
                                <div className='absolute z-20 top-0 left-0 h-screen w-screen backdrop-blur-sm bg-[#ffffff40] '>
                                    <div className='bg-pink-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 rounded-xl shadow-xl z-30'>
                                        <h2 className='text-white font-bold text-lg mb-2'>Update Sequence</h2>
                                        <input
                                            type='number'
                                            value={newSeq}
                                            onChange={(e) => setNewSeq(e.target.value)}
                                            className='p-2 rounded w-full mb-4'
                                            placeholder='Enter new sequence'
                                        />
                                        <div className='flex gap-4'>
                                            <button
                                                onClick={handleUpdateSeq}
                                                className='bg-white text-pink-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100'
                                            >
                                                Submit
                                            </button>
                                            <button
                                                onClick={handleSeqFormOpen}
                                                className='bg-white text-gray-600 font-semibold px-4 py-2 rounded shadow hover:bg-gray-200'
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                        <p className="text-3xl font-bold text-gray-900">{employees.length}</p>
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
                                        <TableHead>Daily Report</TableHead>
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
                                                            <button
                                                                onClick={() => handleViewEmployee(employee)}
                                                                className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                                                            >
                                                                {employee.name}
                                                            </button>
                                                            <p className="text-sm text-gray-500">{employee.id}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{employee.position}</TableCell>
                                                <TableCell>
                                                    <div className="max-w-xs">
                                                        {attendance?.date ? (
                                                            <p className="text-sm text-gray-700 truncate" title={attendance.dailyReport}>
                                                                {attendance.dailyReport}
                                                            </p>
                                                        ) : (
                                                            <span className="text-gray-400 text-sm">No report</span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-green-600 font-medium">
                                                        {attendance?.checkintime ? formatTime(attendance.checkintime) : '--:--'}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-blue-600 font-medium">
                                                        {attendance?.checkouttime ? formatTime(attendance.checkouttime) : '--:--'}
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

                {/* View Employee Modal */}
                <ViewEmployeeModal
                    isOpen={isViewEmployeeModalOpen}
                    onClose={() => setIsViewEmployeeModalOpen(false)}
                    employee={viewingEmployee}
                    attendanceRecords={attendanceRecords}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
