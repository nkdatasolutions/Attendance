import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, LogIn, LogOut, Building2, Search } from 'lucide-react';
import { toast } from 'sonner';
import ThreeBackground from '@/components/ThreeBackground';
import EmployeeModal from '@/components/EmployeeModal';
import EmployeeList from '@/components/EmployeeList';
import { mockEmployees, initialAttendanceRecords, Employee } from '@/data/mockEmployees';

interface AttendanceRecord {
  employeeId: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'absent' | 'checked-out';
  date: string;
  dailyReport?: string;
}

const Index = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCheckingIn, setIsCheckingIn] = useState(true);
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
    const [liveTime, setLiveTime] = useState<string>('');
    const [liveDate, setLiveDate] = useState<string>('');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
            timeZone: 'Asia/Kolkata'
        });
    };

    const fetchLiveTime = async () => {
        try {
            const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Kolkata');
            const data = await response.json();
            const dateTime = new Date(data.datetime);
            
            const timeString = dateTime.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            
            const dateString = dateTime.toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            setLiveTime(timeString);
            setLiveDate(dateString);
        } catch (error) {
            console.error('Failed to fetch live time:', error);
            // Fallback to local time if API fails
            const fallbackTime = new Date().toLocaleTimeString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
            const fallbackDate = new Date().toLocaleDateString('en-IN', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            setLiveTime(fallbackTime);
            setLiveDate(fallbackDate);
        }
    };

    useEffect(() => {
        // Initial fetch
        fetchLiveTime();
        
        // Set up interval to fetch time every second
        intervalRef.current = setInterval(fetchLiveTime, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const getTodayDateString = () => {
        return new Date().toLocaleDateString('en-IN', {
            timeZone: 'Asia/Kolkata',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    const getCurrentIndianHour = () => {
        const now = new Date();
        return now.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            hour: '2-digit',
            hour12: false
        });
    };

    const isCheckInTimeAllowed = () => {
        const currentHour = parseInt(getCurrentIndianHour());
        return currentHour >= 9 && currentHour < 15; // 9:00 AM to 2:59 PM (before 3:00 PM)
    };

    const getCheckInTimeMessage = () => {
        const currentHour = parseInt(getCurrentIndianHour());
        if (currentHour < 9) {
            return 'Check-in will be available from 9:00 AM';
        } else if (currentHour >= 15) {
            return 'Check-in time has ended (available only till 3:00 PM)';
        }
        return '';
    };

    const handleAttendanceAction = (checkIn: boolean) => {
        if (!employeeId.trim()) {
            toast.error('Please enter your Employee ID');
            return;
        }

        const employee = mockEmployees.find(emp => emp.id === employeeId.toUpperCase());
        if (!employee) {
            toast.error('Employee not found. Please check your ID.');
            return;
        }

        const todayDate = getTodayDateString();
        const existingRecord = attendanceRecords.find(record =>
            record.employeeId === employee.id && record.date === todayDate
        );

        if (checkIn) {
            // Check if check-in time is allowed
            if (!isCheckInTimeAllowed()) {
                const timeMessage = getCheckInTimeMessage();
                toast.error(timeMessage);
                return;
            }

            // Check if already checked in today
            if (existingRecord && (existingRecord.status === 'present' || existingRecord.status === 'checked-out')) {
                toast.error('You have already checked in today! Only one check-in per day is allowed.');
                return;
            }
        } else {
            if (!existingRecord || existingRecord.status !== 'present') {
                toast.error('You need to check in first!');
                return;
            }
        }

        setSelectedEmployee(employee);
        setIsCheckingIn(checkIn);
        setIsModalOpen(true);
    };

    const confirmAttendance = (dailyReport?: string) => {
        if (!selectedEmployee) return;

        const currentTime = getIndianTime();
        const todayDate = getTodayDateString();

        setAttendanceRecords(prev => {
            const existingIndex = prev.findIndex(record =>
                record.employeeId === selectedEmployee.id && record.date === todayDate
            );

            if (isCheckingIn) {
                const newRecord: AttendanceRecord = {
                    employeeId: selectedEmployee.id,
                    checkInTime: currentTime,
                    checkOutTime: null,
                    status: 'present',
                    date: todayDate
                };

                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = newRecord;
                    return updated;
                } else {
                    return [...prev, newRecord];
                }
            } else {
                // Check out with daily report
                if (existingIndex >= 0) {
                    const updated = [...prev];
                    updated[existingIndex] = {
                        ...updated[existingIndex],
                        checkOutTime: currentTime,
                        status: 'checked-out',
                        dailyReport: dailyReport
                    };
                    return updated;
                }
            }

            return prev;
        });

        toast.success(`Successfully ${isCheckingIn ? 'checked in' : 'checked out'}!`);
        setIsModalOpen(false);
        setSelectedEmployee(null);
        setEmployeeId('');
    };

    const handleQuickCheckOut = (employeeId: string) => {
        const employee = mockEmployees.find(emp => emp.id === employeeId);
        if (employee) {
            setSelectedEmployee(employee);
            setIsCheckingIn(false);
            setIsModalOpen(true);
        }
    };

    const checkInAllowed = isCheckInTimeAllowed();
    const timeMessage = getCheckInTimeMessage();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative">
            <ThreeBackground />

            {/* Modern Header */}
            <div className="relative z-10">
                <header className="bg-white shadow-sm border-b sticky top-0 z-20">
                    <div className="container mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-white to-green-500 rounded-xl flex items-center justify-center">
                                        <Building2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-xl font-bold text-gray-900">NK Data Solutions</h1>
                                        <p className="text-sm text-gray-500">Attendance Management</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4 text-gray-600">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <div className="text-right">
                                    <p className="text-lg font-medium">{liveDate}</p>
                                    <p className="text-base text-gray-500">{liveTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <main className=" px-4 py-8 space-y-8">
                    {/* Hero Section */}
                    <div className="text-center space-y-4 py-8">
                        <h2 className="text-4xl font-bold text-gray-900">
                            Welcome to Your Workplace
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Track your time, manage your presence, and excel in your career with our modern attendance system
                        </p>
                    </div>
                    <div className="container flex flex-col lg:flex-row justify-evenly items-start p-4 gap-4">
                        {/* Attendance Card */}
                        <Card className="max-w-4xl bg-white shadow-xl border-0 rounded-2xl overflow-hidden mx-auto space-y-4 space-x-4">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                                <CardTitle className="text-2xl font-bold text-white text-center">
                                    Employee Check-In/Out
                                </CardTitle>
                            </div>
                            <CardContent className="p-8 space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Enter your Employee ID (e.g., NK001)"
                                        value={employeeId}
                                        onChange={(e) => setEmployeeId(e.target.value)}
                                        className="pl-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                                    />
                                </div>

                                {/* Time Restriction Notice */}
                                {!checkInAllowed && (
                                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                                        <p className="text-yellow-800 text-sm font-medium text-center">
                                            <Clock className="w-4 h-4 inline mr-2" />
                                            {timeMessage}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => handleAttendanceAction(true)}
                                        disabled={!checkInAllowed}
                                        className={`h-14 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all ${checkInAllowed
                                                ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                                                : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        <LogIn className="w-6 h-6 mr-3" />
                                        Check In
                                    </Button>
                                    <Button
                                        onClick={() => handleAttendanceAction(false)}
                                        className="h-14 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                                    >
                                        <LogOut className="w-6 h-6 mr-3" />
                                        Check Out
                                    </Button>
                                </div>

                                <div className="text-center p-4 bg-gray-50 rounded-xl space-y-2">
                                    <p className="text-sm text-gray-600">
                                        <strong>Demo Employee IDs:</strong> NK001, NK002, NK003, NK004, NK005
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Check-in available: 9:00 AM - 3:00 PM (IST)
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Employee List */}
                        <EmployeeList
                            employees={mockEmployees}
                            attendanceRecords={attendanceRecords}
                            onCheckOut={handleQuickCheckOut}
                        />
                        {/* Employee Modal */}
                        <EmployeeModal
                            employee={selectedEmployee}
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onConfirm={confirmAttendance}
                            isCheckingIn={isCheckingIn}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Index;
