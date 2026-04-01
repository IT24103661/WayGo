import React, { useCallback, useState, useEffect } from 'react';
import { MdEdit, MdPersonOutline } from 'react-icons/md';

export default function SettingsSection() {
    const [user, setUser] = useState(null);
    const [vehicle, setVehicle] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [vehicleEditMode, setVehicleEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [vehicleLoading, setVehicleLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        rate: '2000',
    });
    const [vehicleFormData, setVehicleFormData] = useState({
        plateNumber: '',
        make: '',
        model: '',
        year: '',
        color: '',
        capacity: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [vehicleErrors, setVehicleErrors] = useState({});
    const [inputPopupError, setInputPopupError] = useState('');

    useEffect(() => {
        if (!inputPopupError) return undefined;
        const timer = setTimeout(() => setInputPopupError(''), 2000);
        return () => clearTimeout(timer);
    }, [inputPopupError]);

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

    const fetchVehicleProfile = useCallback(async () => {
        try {
            const token = localStorage.getItem('waygo_token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/driver/profile/vehicle`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const json = await parseResponse(res);
            if (res.status === 401) handleUnauthorized(json);

            if (res.status === 404) {
                setVehicle(null);
                setVehicleFormData({
                    plateNumber: '',
                    make: '',
                    model: '',
                    year: '',
                    color: '',
                    capacity: ''
                });
                return;
            }

            if (res.ok && json.data) {
                setVehicle(json.data);
                setVehicleFormData({
                    plateNumber: json.data.plateNumber || '',
                    make: json.data.make || '',
                    model: json.data.model || '',
                    year: json.data.year || '',
                    color: json.data.color || '',
                    capacity: json.data.capacity || ''
                });
            }
        } catch (e) {
            console.error('Failed to fetch vehicle profile', e);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
        fetchVehicleProfile();
    }, [fetchProfile, fetchVehicleProfile]);

    const handleSave = async () => {
        const errors = {};
        const trimmedName = formData.name.trim();
        const trimmedEmail = formData.email.trim();
        const trimmedPhone = formData.phone.trim();

        if (!trimmedName) {
            errors.name = 'Name is required.';
        } else if (trimmedName.length < 3) {
            errors.name = 'Name should be at least 3 characters.';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!trimmedEmail) {
            errors.email = 'Email is required.';
        } else if (!emailRegex.test(trimmedEmail)) {
            errors.email = 'Enter a valid email address.';
        }

        const numericPhone = trimmedPhone.replace(/\D/g, '');
        if (!trimmedPhone) {
            errors.phone = 'Phone number is required.';
        } else if (numericPhone.length < 9 || numericPhone.length > 15) {
            errors.phone = 'Phone number should be 9 to 15 digits.';
        }

        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

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
            setFormErrors({});
            window.dispatchEvent(new Event('userUpdated'));
            alert('Profile updated successfully!');
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVehicleSave = async () => {
        const errors = {};
        const plate = vehicleFormData.plateNumber.trim().toUpperCase();

        if (!/^[A-Z]{2,3}-\d{4}$/.test(plate)) {
            errors.plateNumber = 'Plate number must follow format ABC-1234.';
        }

        if (!vehicleFormData.make.trim()) {
            errors.make = 'Vehicle make is required.';
        }

        if (!vehicleFormData.model.trim()) {
            errors.model = 'Vehicle model is required.';
        }

        const yearNumber = Number(vehicleFormData.year);
        const currentYear = new Date().getFullYear() + 1;
        if (Number.isNaN(yearNumber) || yearNumber < 1980 || yearNumber > currentYear) {
            errors.year = `Year must be between 1980 and ${currentYear}.`;
        }

        const capacityNumber = Number(vehicleFormData.capacity);
        if (Number.isNaN(capacityNumber) || capacityNumber < 1 || capacityNumber > 60) {
            errors.capacity = 'Capacity must be between 1 and 60.';
        }

        setVehicleErrors(errors);
        if (Object.keys(errors).length > 0) {
            return;
        }

        setVehicleLoading(true);
        try {
            const token = localStorage.getItem('waygo_token');
            const res = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/driver/profile/vehicle`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    plateNumber: plate,
                    make: vehicleFormData.make,
                    model: vehicleFormData.model,
                    year: yearNumber,
                    color: vehicleFormData.color,
                    capacity: capacityNumber
                })
            });
            const json = await parseResponse(res);
            if (res.status === 401) handleUnauthorized(json);
            if (!res.ok) throw new Error(json.message || 'Failed to update vehicle profile');

            setVehicle(json.data);
            setVehicleEditMode(false);
            setVehicleErrors({});
            alert('Vehicle details updated successfully!');
        } catch (error) {
            alert(error.message);
        } finally {
            setVehicleLoading(false);
        }
    };

    return (
        <div className='space-y-8'>
            {inputPopupError && (
                <div className='fixed top-5 right-5 z-50'>
                    <div className='rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 shadow-lg'>
                        {inputPopupError}
                    </div>
                </div>
            )}

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
                                    <>
                                        <input 
                                            className='w-full px-4 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all'
                                            value={formData[key]}
                                            onChange={e => {
                                                const rawValue = e.target.value;
                                                if (key === 'phone' && /\D/.test(rawValue)) {
                                                    setInputPopupError('Only numbers are allowed for contact number.');
                                                    setFormErrors((prev) => ({
                                                        ...prev,
                                                        phone: 'Only numbers are allowed for contact number.'
                                                    }));
                                                } else if (key === 'phone') {
                                                    setFormErrors((prev) => ({
                                                        ...prev,
                                                        phone: ''
                                                    }));
                                                }
                                                const value = key === 'phone'
                                                    ? rawValue.replace(/\D/g, '')
                                                    : rawValue;
                                                setFormData({ ...formData, [key]: value });
                                            }}
                                            type={key === 'email' ? 'email' : 'text'}
                                            inputMode={key === 'phone' ? 'numeric' : undefined}
                                            pattern={key === 'phone' ? '[0-9]*' : undefined}
                                            maxLength={key === 'phone' ? 15 : undefined}
                                        />
                                        {formErrors[key] && <p className='text-xs text-rose-600 mt-1'>{formErrors[key]}</p>}
                                    </>
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

            <div className='bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-[0_20px_45px_-35px_rgba(16,185,129,0.2)] border border-emerald-200'>
                <div className='flex justify-between items-center mb-8'>
                    <h3 className='text-lg font-bold text-emerald-950 flex items-center gap-2'>
                        <MdPersonOutline className='text-emerald-500 text-2xl' />
                        Vehicle Information
                    </h3>
                    <button
                        onClick={vehicleEditMode ? handleVehicleSave : () => setVehicleEditMode(true)}
                        disabled={vehicleLoading || !vehicle}
                        className='px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 flex items-center gap-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:-translate-y-0.5 disabled:opacity-60'
                    >
                        {vehicleEditMode ? (vehicleLoading ? 'Saving...' : 'Save Vehicle') : (
                            <>
                                <MdEdit />
                                Edit Vehicle
                            </>
                        )}
                    </button>
                </div>

                {!vehicle && (
                    <div className='px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm'>
                        No vehicle is currently assigned to your driver profile. Please contact your fleet manager.
                    </div>
                )}

                {vehicle && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        {[
                            ['plateNumber', 'Plate Number'],
                            ['make', 'Make'],
                            ['model', 'Model'],
                            ['year', 'Year'],
                            ['color', 'Color'],
                            ['capacity', 'Capacity']
                        ].map(([key, label]) => (
                            <div key={key} className='space-y-2'>
                                <label className='text-sm font-semibold text-emerald-800'>{label}</label>
                                {vehicleEditMode ? (
                                    <>
                                        <input
                                            className='w-full px-4 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all'
                                            value={vehicleFormData[key]}
                                            onChange={(e) => {
                                                const value = key === 'plateNumber' ? e.target.value.toUpperCase() : e.target.value;
                                                setVehicleFormData({ ...vehicleFormData, [key]: value });
                                            }}
                                            placeholder={key === 'plateNumber' ? 'BGK-1234' : undefined}
                                        />
                                        {vehicleErrors[key] && <p className='text-xs text-rose-600 mt-1'>{vehicleErrors[key]}</p>}
                                    </>
                                ) : (
                                    <div className='px-4 py-3 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-emerald-900 font-medium break-words'>
                                        {vehicleFormData[key] || 'Not Set'}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}