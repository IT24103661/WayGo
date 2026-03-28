import React from 'react';
import { MdEmail, MdPhone, MdLiveHelp, MdBuild } from 'react-icons/md';

export default function SupportSection() {
    return (
        <div className='space-y-8'>
            <div className='flex flex-col gap-2'>
                <p className='text-xs font-semibold tracking-[0.3em] text-emerald-700 uppercase'>Help Center</p>
                <h2 className='text-2xl font-bold text-emerald-950'>Support & Operations</h2>
                <p className='text-emerald-700/80'>Get help with your driver account and current assigned tours.</p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {[{
                    title: 'System Support',
                    desc: 'For app issues, login, or earnings discrepancies.',
                    icon: MdBuild,
                }, {
                    icon: MdPhone,
                    title: 'Urgent Dispatch',
                    desc: 'Immediate assistance during an active tour or breakdown.',
                }, {
                    icon: MdEmail,
                    title: 'Feedback',
                    desc: 'Share ideas to improve the WayGo Driver app.',
                }].map((item, idx) => (
                    <div key={idx} className='bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-[0_20px_45px_-35px_rgba(16,185,129,0.2)] border border-emerald-200 flex flex-col items-start gap-4 hover:-translate-y-1 transition-all duration-300'>
                        <div className='p-3 bg-emerald-100 rounded-xl text-emerald-600'>
                            <item.icon className='text-3xl' />
                        </div>
                        <div>
                            <h3 className='font-bold text-emerald-950 mb-1'>{item.title}</h3>
                            <p className='text-sm text-emerald-700/80'>{item.desc}</p>
                        </div>
                        <button className='mt-auto text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group'>
                            Contact <span className='group-hover:translate-x-1 transition-transform'>→</span>
                        </button>
                    </div>
                ))}
            </div>
            
            <div className='bg-emerald-950 rounded-3xl p-8 text-white flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden'>
                <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.2),transparent_50%)]' />
                <div className='relative z-10 space-y-2'>
                    <h3 className='text-xl font-bold flex items-center gap-2'>
                        <MdLiveHelp className='text-emerald-400' />
                        Need immediate assistance?
                    </h3>
                    <p className='text-emerald-200/80 text-sm'>Our operations team is available 24/7 for active tours.</p>
                </div>
                <button className='relative z-10 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-colors whitespace-nowrap'>
                    Call Hotline
                </button>
            </div>
        </div>
    );
}