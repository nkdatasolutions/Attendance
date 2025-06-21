
export interface Employee {
  id: string;
  name: string;
  position: string;
  accountno: string;
  photo: string;
  email: string;
  phone?: string;
  degree?: string;
}

export interface AttendanceRecord {
  employeeId: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: 'present' | 'absent' | 'checked-out';
  date: string;
}

export const mockEmployees: Employee[] = [
  {
    id: 'NK001',
    name: 'Sneha',
    position: 'Senior Epub Developer',
    accountno: 'Content Development',
    photo: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face',
    email: 'sarah.johnson@company.com',
    phone: '+91 9876543210',
    degree: 'B.Tech Computer Science',
  },
  {
    id: 'NK002',
    name: 'Vasuki',
    position: 'Xml Developer',
    accountno: 'Content Development',
    photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&h=150&fit=crop&crop=face',
    email: 'michael.chen@company.com',
    phone: '+91 9876543211',
    degree: 'B.Sc Information Technology'
  },
  {
    id: 'NK003',
    name: 'Dileepan',
    position: 'Lead Epub Developer',
    accountno: 'Content Development',
    photo: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face',
    email: 'emily.rodriguez@company.com',
    phone: '+91 9876543212',
    degree: 'M.Tech Software Engineering'
  },
  {
    id: 'NK004',
    name: 'Thinakaran',
    position: 'Senior Xml Developer',
    accountno: 'Content Development',
    photo: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=150&h=150&fit=crop&crop=face',
    email: 'david.kim@company.com',
    phone: '+91 9876543213',
    degree: 'B.E Electronics'
  },
  {
    id: 'NK005',
    name: 'Arun',
    position: 'Epub Developer',
    accountno: 'Content Development',
    photo: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
    email: 'lisa.thompson@company.com',
    phone: '+91 9876543214',
    degree: 'BCA'
  }
];

const getTodayDateString = () => {
  return new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export const initialAttendanceRecords: AttendanceRecord[] = [
  {
    employeeId: 'NK001',
    checkInTime: '09:15 AM',
    checkOutTime: null,
    status: 'present',
    date: getTodayDateString()
  },
  {
    employeeId: 'NK002',
    checkInTime: '08:45 AM',
    checkOutTime: '05:30 PM',
    status: 'checked-out',
    date: getTodayDateString()
  }
];
