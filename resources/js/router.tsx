import { Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/welcome';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import Dashboard from './pages/dashboard';
import Profile from './pages/settings/profile';
import Appearance from './pages/settings/appearance';
import Password from './pages/settings/password';
import LectureClasses from './pages/lecturePayments/classes';
import LecturePaymentsIndex from './pages/lecturePayments/index';
import LecturePaymentForm from './pages/lecturePayments/form';
import StudentPaymentsIndex from './pages/studentPayments/index';
import StudentPaymentForm from './pages/studentPayments/form';
import CollectionReport from './pages/reports/collection';

import StudentsIndex from './pages/students/index';
import StudentCreate from './pages/students/create';
import LecturesIndex from './pages/lectures/index';
import LectureCreateOrEdit from './pages/lectures/CreateOrEdit';
import SchoolsIndex from './pages/schools/index';
import SchoolCreateOrEdit from './pages/schools/CreateOrEdit';
import ClassesIndex from './pages/classes/index';
import ClassCreateOrEdit from './pages/classes/create';
import ClassroomsIndex from './pages/classrooms/index';
import ClassroomCreateOrEdit from './pages/classrooms/create';
import Enrollments from './pages/enrollments/enrollments';
import UserIndex from './pages/users/index';
import UserForm from './pages/users/form';

// Placeholder for auth check
const isAuthenticated = () => !!localStorage.getItem('auth_token') || true; // Mocked for now

export function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login canResetPassword={true} />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
                path="/dashboard" 
                element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} 
            />

            <Route 
                path="/settings/profile" 
                element={isAuthenticated() ? <Profile mustVerifyEmail={false} /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/settings/appearance" 
                element={isAuthenticated() ? <Appearance /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/settings/password" 
                element={isAuthenticated() ? <Password /> : <Navigate to="/login" />} 
            />

            {/* Student Management */}
            <Route path="/students" element={isAuthenticated() ? <StudentsIndex /> : <Navigate to="/login" />} />
            <Route path="/students/create" element={isAuthenticated() ? <StudentCreate /> : <Navigate to="/login" />} />
            <Route path="/students/:sid/edit" element={isAuthenticated() ? <StudentCreate /> : <Navigate to="/login" />} />

            {/* Teacher/Lecture Management */}
            <Route path="/lectures" element={isAuthenticated() ? <LecturesIndex /> : <Navigate to="/login" />} />
            <Route path="/lectures/create" element={isAuthenticated() ? <LectureCreateOrEdit /> : <Navigate to="/login" />} />
            <Route path="/lectures/:lid/edit" element={isAuthenticated() ? <LectureCreateOrEdit /> : <Navigate to="/login" />} />

            {/* School Management */}
            <Route path="/schools" element={isAuthenticated() ? <SchoolsIndex /> : <Navigate to="/login" />} />
            <Route path="/schools/create" element={isAuthenticated() ? <SchoolCreateOrEdit /> : <Navigate to="/login" />} />
            <Route path="/schools/:schoolId/edit" element={isAuthenticated() ? <SchoolCreateOrEdit /> : <Navigate to="/login" />} />

            {/* Class Management */}
            <Route path="/classes" element={isAuthenticated() ? <ClassesIndex /> : <Navigate to="/login" />} />
            <Route path="/classes/create" element={isAuthenticated() ? <ClassCreateOrEdit /> : <Navigate to="/login" />} />
            <Route path="/classes/:cid/edit" element={isAuthenticated() ? <ClassCreateOrEdit /> : <Navigate to="/login" />} />

            {/* Classroom Management */}
            <Route path="/classrooms" element={isAuthenticated() ? <ClassroomsIndex /> : <Navigate to="/login" />} />
            <Route path="/classrooms/create" element={isAuthenticated() ? <ClassroomCreateOrEdit /> : <Navigate to="/login" />} />
            <Route path="/classrooms/:classroomId/edit" element={isAuthenticated() ? <ClassroomCreateOrEdit /> : <Navigate to="/login" />} />

            {/* Enrollment Hub */}
            <Route path="/enrollments" element={isAuthenticated() ? <Enrollments /> : <Navigate to="/login" />} />

            <Route 
                path="/lecture-payments" 
                element={isAuthenticated() ? <LecturePaymentsIndex /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/lecture-payments/classes" 
                element={isAuthenticated() ? <LectureClasses /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/lecture-payments/create" 
                element={isAuthenticated() ? <LecturePaymentForm /> : <Navigate to="/login" />} 
            />
            
            <Route 
                path="/student-payments" 
                element={isAuthenticated() ? <StudentPaymentsIndex /> : <Navigate to="/login" />} 
            />
            <Route 
                path="/student-payments/create" 
                element={isAuthenticated() ? <StudentPaymentForm /> : <Navigate to="/login" />} 
            />

            {/* Reports */}
            <Route 
                path="/reports/collection" 
                element={isAuthenticated() ? <CollectionReport /> : <Navigate to="/login" />} 
            />

            {/* User Management */}
            <Route path="/users" element={isAuthenticated() ? <UserIndex /> : <Navigate to="/login" />} />
            <Route path="/users/create" element={isAuthenticated() ? <UserForm /> : <Navigate to="/login" />} />
            <Route path="/users/:id/edit" element={isAuthenticated() ? <UserForm /> : <Navigate to="/login" />} />

            {/* Catch-all route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
