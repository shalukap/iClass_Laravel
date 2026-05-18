import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Edit3, Trash2, School as SchoolIcon, Building2, MapPin, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Schools', href: '/schools' },
];

interface School {
    schoolId: string;
    name: string;
}

export default function Index() {
    const [schools, setSchools] = useState<School[]>([]);
    const [searchSchool, setSearchSchool] = useState('');
    const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSchools = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/schools');
            setSchools(response.data.schools || []);
            setFilteredSchools(response.data.schools || []);
        } catch (error) {
            console.error('Error fetching schools:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    useEffect(() => {
        const searchQuery = searchSchool.toLowerCase();
        const filtered = schools.filter(
            (school) =>
                (school.schoolId?.toLowerCase() || '').includes(searchQuery) ||
                (school.name?.toLowerCase() || '').includes(searchQuery)
        );
        setFilteredSchools(filtered);
    }, [searchSchool, schools]);

    const handleDelete = (id: string) => {
        Swal.fire({
            title: 'Delete School?',
            text: "This may affect associated students and lecturers.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Yes, delete school',
            background: '#1e293b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/schools/${id}`);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'School has been removed from the directory.',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff'
                    });
                    fetchSchools();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete school.',
                        icon: 'error',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>Schools - iClass Management</title>
            </Helmet>
            
            <div className="p-8 space-y-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Partner Schools</h1>
                        <p className="text-muted-foreground">Directory of educational institutions integrated with the platform.</p>
                    </div>
                    <Button onClick={() => navigate('/schools/create')} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-11 px-6 rounded-xl">
                        <Plus className="mr-2 h-5 w-5" />
                        Register School
                    </Button>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                                <Building2 className="h-5 w-5 text-indigo-400" />
                                Institutions
                            </CardTitle>
                            <div className="w-full md:w-96 relative">
                                <Input
                                    placeholder="Search by name or ID..."
                                    value={searchSchool}
                                    onChange={(e) => setSearchSchool(e.target.value)}
                                    className="bg-slate-900 border-white/10 text-white h-11 pl-10 rounded-xl"
                                />
                                <Search className="absolute left-3 top-3 h-5 w-5 text-white/20" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                                <p>Loading institutions...</p>
                            </div>
                        ) : filteredSchools.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredSchools.map((school) => (
                                    <div key={school.schoolId} className="group relative bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/[0.08] transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-indigo-500/10">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-colors">
                                                <SchoolIcon className="h-6 w-6 text-indigo-400" />
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button asChild size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/10">
                                                    <Link to={`/schools/${school.schoolId}/edit`}>
                                                        <Edit3 className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button onClick={() => handleDelete(school.schoolId)} size="icon" variant="ghost" className="h-8 w-8 text-white/40 hover:text-rose-400 hover:bg-rose-500/10">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <h3 className="font-bold text-white text-lg group-hover:text-indigo-300 transition-colors">{school.name}</h3>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                                    <Info className="h-3.5 w-3.5" />
                                                    <span className="font-mono">ID: {school.schoolId}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-white/40 text-xs">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    <span>Sri Lanka</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                            <Badge variant="outline" className="border-white/10 text-white/40 text-[10px] uppercase tracking-widest px-2 py-0">
                                                Active Partner
                                            </Badge>
                                            <Link 
                                                to={`/schools/${school.schoolId}/edit`} 
                                                className="text-indigo-400 text-xs font-bold hover:underline"
                                            >
                                                Manage Details
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                    <Building2 className="h-10 w-10 text-white/20" />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">No schools found</h3>
                                <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                                    Register a school to start managing students and academic schedules.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
