import React, { useState, useEffect } from 'react';
import { MdEdit, MdPersonOutline, MdAttachMoney } from 'react-icons/md';

export default function SettingsSection() {
    const [user, setUser] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        rate: '2000',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsed = JSON.parse(storedUser);
                setUser(parsed);
                setFormData({
                    name: parsed.name || '',
                    email: parsed.email || '',
                    phone: parsed.phone || '',
                    rate: parsed.rate || '2000',
                });
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    const handleSave = () => {
        setEditMode(false);
        const updatedUser = { ...user, ...formData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        window.dispatchEvent(new Event('userUpdated'));
    };

    return (
        <div className='space-y-8'>
            <div className='flex flex-col gap-2'>
                <p className='text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase'>Preferences</p>
                <h2 className='text-2xl font-bold text-emerald-950'>Account Settings</h2>
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
                        className='px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:-translate-y-0.5'
                    >
                        {editMode ? 'Save Changes' : (
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
                                        disabled={key==='email'}
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