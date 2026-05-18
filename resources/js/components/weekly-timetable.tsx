import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, MapPin, ChevronRight, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ClassItem {
    id: number;
    cid: string;
    name: string;
    day: string;
    time_start: string;
    time_end: string;
    grade: number;
    color_code: string;
    classroom?: { name: string };
    lecturer?: { lec_name: string };
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function formatTime12Hour(time24: string) {
    if (!time24) return '-';
    try {
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12 || 12;
        return `${hour}:${minute} ${ampm}`;
    } catch (e) {
        return time24;
    }
}

export default function WeeklyTimetable() {
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeDay, setActiveDay] = useState(new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date()));

    const hasUnscheduled = classes.some(c => !c.day);
    const displayedDays = hasUnscheduled ? [...DAYS, 'Unscheduled'] : DAYS;

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await axios.get('/api/classes');
                const fetchedClasses = response.data.classes || [];
                setClasses(fetchedClasses);
                
                // If today has no classes but there are unscheduled ones, maybe switch to Unscheduled
                const today = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
                const hasTodayClasses = fetchedClasses.some((c: any) => c.day === today);
                if (!hasTodayClasses && fetchedClasses.some((c: any) => !c.day)) {
                    setActiveDay('Unscheduled');
                }
            } catch (error) {
                console.error('Error fetching classes for timetable:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchClasses();
    }, []);

    const filteredClasses = classes
        .filter(c => {
            if (activeDay === 'Unscheduled') return !c.day;
            return c.day === activeDay;
        })
        .sort((a, b) => (a.time_start || '').localeCompare(b.time_start || ''));

    const getColorClass = (color: string) => {
        const colors: Record<string, string> = {
            blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400',
            indigo: 'from-indigo-500/20 to-indigo-500/5 border-indigo-500/20 text-indigo-400',
            purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400',
            rose: 'from-rose-500/20 to-rose-500/5 border-rose-500/20 text-rose-400',
            amber: 'from-amber-500/20 to-amber-500/5 border-amber-500/20 text-amber-400',
            emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-400',
            cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
        };
        return colors[color] || colors.indigo;
    };

    return (
        <Card className="border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden h-full">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-black text-white flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/20 rounded-lg">
                            <Calendar className="h-5 w-5 text-indigo-400" />
                        </div>
                        Weekly Timetable
                    </CardTitle>
                    <Link to="/classes">
                        <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/5 text-xs">
                            View All <ChevronRight className="ml-1 h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Day Selector */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {displayedDays.map((day) => (
                        <button
                            key={day}
                            onClick={() => setActiveDay(day)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                                activeDay === day
                                    ? day === 'Unscheduled' 
                                        ? 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/20'
                                        : 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                                    : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10'
                            }`}
                        >
                            {day === 'Unscheduled' ? 'Unscheduled' : day.substring(0, 3)}
                        </button>
                    ))}
                </div>

                {/* Class List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center opacity-20">
                            <div className="h-8 w-8 rounded-full border-2 border-white border-t-transparent animate-spin mb-4" />
                            <p className="text-xs uppercase tracking-widest">Loading Schedule...</p>
                        </div>
                    ) : filteredClasses.length > 0 ? (
                        filteredClasses.map((c) => (
                            <div
                                key={c.cid}
                                className={`group p-4 rounded-2xl bg-gradient-to-br border transition-all hover:scale-[1.02] ${getColorClass(c.color_code)}`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-black text-white text-base leading-tight group-hover:text-white transition-colors">{c.name}</span>
                                            <Badge className="bg-white/10 text-white border-none text-[9px] font-bold">Grade {c.grade}</Badge>
                                        </div>
                                        <div className="flex flex-col gap-1 mt-1 opacity-80">
                                            <div className="flex items-center gap-1.5 text-xs">
                                                <Clock className="h-3 w-3" />
                                                <span>{formatTime12Hour(c.time_start)} - {formatTime12Hour(c.time_end)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px]">
                                                <MapPin className="h-3 w-3" />
                                                <span>{c.classroom?.name || 'Venue Unassigned'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                        <GraduationCap className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Lec: {c.lecturer?.lec_name || 'TBA'}</span>
                                    <span className="text-[10px] font-mono opacity-40">CID: {c.cid}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-16 flex flex-col items-center justify-center text-center px-6">
                            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                                <Calendar className="h-8 w-8 text-white/10" />
                            </div>
                            <h4 className="text-white font-bold mb-1 text-sm">No Classes Scheduled</h4>
                            <p className="text-white/30 text-xs leading-relaxed">
                                {activeDay === 'Unscheduled' 
                                    ? 'All classes have been assigned a schedule.' 
                                    : `There are no academic sessions registered for ${activeDay}.`}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
