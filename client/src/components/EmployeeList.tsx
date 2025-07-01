import { Clock, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

interface AttendanceRecord {
    id: string;
    date: string;
    checkin: boolean;
    checkintime: string | null;
    checkout: boolean;
    checkouttime: string | null;
    absent: boolean;
}

interface Employee {
    id: string;
    name: string;
    position: string;
    photo: string;
    email: string;
    phone: string;
    experience: string;
}

interface EmployeeListProps {
    onCheckOut: (employeeId: string) => void;
}

const EmployeeList = ({ onCheckOut }: EmployeeListProps) => {
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [employeeData, setEmployeeData] = useState<Employee[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getTodayDateString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const attendanceResponse = await fetch(`${API_URL}/employee/attendance-dateall/${getTodayDateString()}`);
                if (!attendanceResponse.ok) throw new Error('No one has checked in today');

                const attendanceData = await attendanceResponse.json();
                const attendanceArray = Array.isArray(attendanceData) ? attendanceData : [attendanceData];

                if (!isMounted) return;
                setAttendanceData(attendanceArray);

                const employeeIds = attendanceArray.map(item => item.id);
                const employeeResponses = await Promise.all(
                    employeeIds.map(id =>
                        fetch(`${API_URL}/admin/employee/${id}`).then(r => r.json())
                    )
                );

                if (isMounted) setEmployeeData(employeeResponses);
            } catch (err) {
                if (isMounted) setError(err.message || 'Unexpected error');
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        const intervalId = setInterval(() => {
            fetchData();
        }, 100); // 100ms = 0.1 sec

        fetchData(); // initial fetch

        return () => {
            isMounted = false;
            clearInterval(intervalId); // cleanup
        };
    }, []);



    const getStatus = (attendance: AttendanceRecord | undefined) => {
        if (!attendance) return 'absent';
        if (attendance.absent) return 'absent';
        if (attendance.checkout) return 'checked-out';
        if (attendance.checkin) return 'present';
        return 'absent';
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present': return 'text-green-600 bg-green-100';
            case 'checked-out': return 'text-blue-600 bg-blue-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return '--:--';
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    if (loading) {
        return (
            <div className="flex flex-col max-w-sm mx-auto items-center justify-center py-16 text-pink-500">
                <div className="text-5xl animate-spin">🌸</div>
                <p className="mt-4 text-lg font-semibold">Loading, please wait...</p>
            </div>
        );
    }



    if (error) {

        if (error === 'No one has checked in today') {
            return (
                <div className="max-w-sm mx-auto mt-12 p-6 bg-pink-50 border border-pink-200 rounded-2xl shadow-lg text-center">
                    <div className="text-5xl mb-4 animate-bounce">😴</div>
                    <h2 className="text-xl font-bold text-pink-600">No one has checked in today</h2>
                    <p className="text-sm text-pink-500 mt-2">Waiting for the first early bird 🐦</p>
                </div>
            )
        } else {
            return <div className="text-center py-8 text-red-500">{error}</div>;
        }
    }

    if (employeeData.length === 0) {
        return <div className="text-center py-8">No employee data available</div>;
    }

    return (
        <div className="space-y-6 mx-auto">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-2 mt-4">Today's Attendance</h2>
                <p className="text-gray-600">Real-time employee presence tracking</p>
            </div>

            <div className="grid gap-4">
                {employeeData.map((employee, index) => {
                    const attendance = attendanceData.find(record => record.id === employee.id);
                    const status = getStatus(attendance);
                    const isPresent = status === 'present';
                    const isCheckedOut = status === 'checked-out';

                    return (
                        <Card key={index} className="bg-white shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
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
                                            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${isPresent ? 'bg-green-500' : isCheckedOut ? 'bg-blue-500' : 'bg-gray-400'
                                                }`} />
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-bold text-gray-900 text-<imglg">{employee.name}</h3>
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <User className="w-4 h-4 mr-1" />
                                                {employee.position}
                                            </div>
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {employee.id}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendance Info */}
                                    <div className="flex items-center space-x-8">
                                        {/* Check In Time */}
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Check In</p>
                                            <p className="font-bold text-green-600 text-lg">
                                                {attendance?.checkintime ? formatTime(attendance.checkintime) : '--:--'}
                                            </p>
                                        </div>

                                        {/* Check Out Time */}
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Check Out</p>
                                            <p className="font-bold text-blue-600 text-lg">
                                                {attendance?.checkouttime ? formatTime(attendance.checkouttime) : '--:--'}
                                            </p>
                                        </div>



                                        {/* Status and Action */}
                                        <div className="flex flex-col items-center space-y-3">
                                            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(status)
                                                }`}>
                                                {status === 'absent' ? 'Absent' : status === 'checked-out' ? 'Checked Out' : 'Present'}
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