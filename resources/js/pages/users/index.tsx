import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, UserPlus, Edit3, Trash2, Shield, Mail, CheckCircle2, XCircle, User2 } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Users', href: '/users' },
];

interface User {
    id: number;
    name: string;
    email: string;
    user_type: 'receptionist' | 'admin' | 'root';
    status: 'active' | 'deactive';
    privileges: string[];
}

export default function Index() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/users');
            setUsers(response.data.users || []);
            setFilteredUsers(response.data.users || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const query = searchQuery.toLowerCase();
        const filtered = users.filter(
            (user) =>
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.user_type.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    }, [searchQuery, users]);

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This user will lose access to the system.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#334155',
            confirmButtonText: 'Yes, delete user',
            background: '#1e293b',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/users/${id}`);
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'User has been removed.',
                        icon: 'success',
                        background: '#1e293b',
                        color: '#fff'
                    });
                    fetchUsers();
                } catch (error) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to delete user.',
                        icon: 'error',
                        background: '#1e293b',
                        color: '#fff'
                    });
                }
            }
        });
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'root': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'admin': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Helmet>
                <title>User Management - iClass</title>
            </Helmet>
            
            <div className="p-8 space-y-6 pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white">System Users</h1>
                        <p className="text-muted-foreground">Manage administrative accounts and access privileges.</p>
                    </div>
                    <Button onClick={() => navigate('/users/create')} className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 h-11 px-6">
                        <UserPlus className="mr-2 h-5 w-5" />
                        Create New User
                    </Button>
                </div>

                <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                    <CardHeader className="pb-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <CardTitle className="text-lg font-medium flex items-center gap-2 text-white">
                                <Search className="h-5 w-5 text-indigo-400" />
                                Search Users
                            </CardTitle>
                            <div className="w-full md:w-96 relative">
                                <Input
                                    placeholder="Search by name, email or type..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-slate-900 border-white/10 text-white h-11 pl-10"
                                />
                                <Search className="absolute left-3 top-3 h-5 w-5 text-white/20" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                                <div className="h-8 w-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mb-4" />
                                <p>Loading user database...</p>
                            </div>
                        ) : filteredUsers.length > 0 ? (
                            <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden overflow-x-auto shadow-2xl">
                                <table className="w-full text-sm text-left border-collapse">
                                    <thead className="bg-white/5 text-white/40 font-bold uppercase tracking-widest text-[10px]">
                                        <tr>
                                            <th className="px-6 py-5">User</th>
                                            <th className="px-6 py-5">Email</th>
                                            <th className="px-6 py-5">User Type</th>
                                            <th className="px-6 py-5">Status</th>
                                            <th className="px-6 py-5 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-white/80">
                                        {filteredUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-white/[0.03] transition-all group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-10 w-10 border border-white/10 ring-2 ring-indigo-500/10 shadow-lg group-hover:ring-indigo-500/30 transition-all">
                                                            <AvatarFallback className="bg-indigo-500/20 text-indigo-300 font-bold">
                                                                {u.name.charAt(0)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-white group-hover:text-indigo-300 transition-colors">{u.name}</span>
                                                            <span className="text-[10px] text-white/20 uppercase tracking-tighter flex items-center gap-1">
                                                                ID: USR-{u.id.toString().padStart(4, '0')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 text-white/60">
                                                        <Mail className="h-3 w-3" />
                                                        <span className="text-xs">{u.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge className={`${getTypeColor(u.user_type)} font-bold capitalize`}>
                                                        <Shield className="mr-1 h-3 w-3" />
                                                        {u.user_type}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {u.status === 'active' ? (
                                                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold">
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Active
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-rose-500/10 text-rose-400 border-rose-500/20 font-bold">
                                                            <XCircle className="mr-1 h-3 w-3" />
                                                            Deactivated
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button asChild size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-indigo-400 hover:bg-indigo-500/10">
                                                            <Link to={`/users/${u.id}/edit`}>
                                                                <Edit3 className="h-4 w-4" />
                                                            </Link>
                                                        </Button>
                                                        <Button onClick={() => handleDelete(u.id)} size="icon" variant="ghost" className="h-9 w-9 text-white/40 hover:text-rose-400 hover:bg-rose-500/10">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-24 text-center">
                                <div className="h-20 w-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                                    <User2 className="h-10 w-10 text-white/20" />
                                </div>
                                <h3 className="text-white font-bold text-xl mb-2">No users found</h3>
                                <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
                                    Start by creating a new administrative or receptionist account to manage the system.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
