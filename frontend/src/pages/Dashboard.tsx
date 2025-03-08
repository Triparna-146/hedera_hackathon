import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { FileText, ListChecks, CheckCircle2 } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const dashboardItems = [
    {
      title: 'Issue Certificate',
      description: 'Create and mint new certificates as NFTs',
      icon: FileText,
      path: '/issue',
      color: 'bg-blue-500',
    },
    {
      title: 'View Certificates',
      description: 'View all certificates issued by you',
      icon: ListChecks,
      path: '/certificates',
      color: 'bg-purple-500',
    },
    {
      title: 'Verify Certificate',
      description: 'Verify the authenticity of any certificate',
      icon: CheckCircle2,
      path: '/verify',
      color: 'bg-green-500',
    },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center">
                <div className={`${item.color} p-3 rounded-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="ml-4 text-lg font-medium text-gray-900">
                  {item.title}
                </h3>
              </div>
              <p className="mt-4 text-sm text-gray-500">{item.description}</p>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}