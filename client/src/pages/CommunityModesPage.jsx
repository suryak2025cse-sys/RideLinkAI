import React, { useState, useEffect } from 'react';
import { Building, GraduationCap, Home, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import EmptyState from '../components/EmptyState';

export default function CommunityModesPage() {
  const navigate = useNavigate();
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const res = await API.get('/communities');
        if (res.data && res.data.communities) {
          setCommunities(res.data.communities);
        }
      } catch (err) {
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCommunities();
  }, []);

  const defaultModes = [
    {
      id: 'campus',
      name: 'Campus Mode',
      icon: GraduationCap,
      description: 'Exclusive ride pooling for university students, staff, and faculty using verified @univ.edu email domains.',
      stats: { members: 340, dailyRides: 42 }
    },
    {
      id: 'corporate',
      name: 'Corporate Mode',
      icon: Building,
      description: 'Verified work email circles for IT parks, corporate headquarters, and office park daily commuters.',
      stats: { members: 510, dailyRides: 68 }
    },
    {
      id: 'residential',
      name: 'Residential Community',
      icon: Home,
      description: 'Gated society ride-sharing connecting neighbors for last-mile metro shuttle trips and errands.',
      stats: { members: 210, dailyRides: 24 }
    },
    {
      id: 'open',
      name: 'Open Community',
      icon: Globe,
      description: 'General public ride-sharing for verified riders traveling on common city corridors.',
      stats: { members: 1200, dailyRides: 180 }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      
      <div className="app-card p-8 rounded-3xl space-y-2">
        <h2 className="text-3xl font-black text-slate-900">Community Modes & Verification</h2>
        <p className="text-base text-slate-500">Tailored verification & matching rules for campuses, corporate hubs, and residential circles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {defaultModes.map((comm) => {
          const Icon = comm.icon;
          return (
            <div
              key={comm.id}
              onClick={() => navigate(`/passenger?communityType=${encodeURIComponent(comm.name)}`)}
              className="app-card app-card-hover p-6 rounded-3xl space-y-4 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">{comm.name}</h3>
                <p className="text-base text-slate-600 leading-relaxed">{comm.description}</p>
              </div>

              <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-2 text-sm text-slate-500 font-medium">
                <div>
                  <span className="block font-bold text-slate-900 text-base">{comm.stats.members}</span>
                  <span>Members</span>
                </div>
                <div>
                  <span className="block font-bold text-emerald-600 text-base">{comm.stats.dailyRides}</span>
                  <span>Active Today</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
