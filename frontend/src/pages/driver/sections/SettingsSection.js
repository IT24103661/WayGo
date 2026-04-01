import React, { useCallback, useState, useEffect } from 'react';
import { MdEdit, MdPersonOutline } from 'react-icons/md';

export default function SettingsSection() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        rate: '2000',
    });

    const parseResponse = async (res) => {
        const text = await res.text();
        if (!text) return {};

        try {
            return JSON.parse(text);
        } catch (parseError) {
            throw new Error('Server returned non-JSON response. Check backend API URL and server status.');
        }
    };

    const handleUnauthorized = (json) => {
        const message = json?.message || 'Session expired. Please log in again.';
        localStorage.removeItem('waygo_token');
        localStorage.removeItem('waygo_role');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
            window.location.href = '/login';
        }
        throw new Error(message);
    };

    const fetchProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('waygo_token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/users/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await parseResponse(res);
            if (res.status === 401) handleUnauthorized(json);
            if (res.ok && json.user) {
                setUser(json.user);
                setFormData({
                    name: json.user.name || '',
                    email: json.user.email || '',
                    phone: json.user.phone || '',
                    rate: json.user.rate || '2000',
                });
            }
        } catch (e) {
            console.error('Failed to fetch profile', e);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('waygo_token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email
                })
            });
            const json = await parseResponse(res);
            if (res.status === 401) handleUnauthorized(json);
            if (!res.ok) throw new Error(json.message || 'Failed to update profile');

            const updatedUser = { ...user, ...json.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setEditMode(false);
            window.dispatchEvent(new Event('userUpdated'));
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='space-y-8'>
            <div className='flex flex-col gap-2'>
                <p className='text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase'>Preferences</p>
                <h2 className='text-2xl font-bold text-emerald-950'>My Profile</h2>
                <p className='text-emerald-700/80'>Manage your profile and payment details.</p>
            </div>

            <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_20px_45px_-35px_rgba(16,185,129,0.2)] border border-emerald-200'>
                <div className='flex justify-between items-center mb-8'>
                    <h3 className='text-lg font-bold text-emerald-950 flex items-center gap-2'>
                        <MdPersonOutline className='text-emerald-500 text-2xl' />
                        Personal Information
                    </h3>
                    <button
                        onClick={editMode ? handleSave : () => setEditMode(true)}
                        disabled={loading}
                        className='px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:-translate-y-0.5'
                    >
                        {editMode ? (loading ? 'Saving...' : 'Save Changes') : (
                            <>
                                <MdEdit />
                                Edit Profile
                            </>
                        )}
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    {['Name', 'Email', 'Phone'].map(field => {
                        const key = field.toLowerCase();
                        return (
                            <div key={key} className='space-y-2'>
                                <label className='text-sm font-semibold text-emerald-800'>{field}</label>
                                {editMode ? (
                                    <input 
                                        className='w-full px-4 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all'
                                        value={formData[key]}
                                        onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                                        type={key === 'email' ? 'email' : 'text'}
                                    />
                                ) : (
                                    <div className='px-4 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-900 font-medium break-words'>
                                        {formData[key] || 'Not Set'}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}