import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Share2, ExternalLink } from 'lucide-react';

export default function CertificateList() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch('http://localhost:3000/certificates'); // Adjust backend URL
        if (!response.ok) {
          throw new Error('Failed to fetch certificates');
        }
        const data = await response.json();
        setCertificates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return <div className="text-center text-gray-600">Loading certificates...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Error: {error}</div>;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Issued Certificates</h1>
        {certificates.length === 0 ? (
          <p className="text-gray-600">No certificates found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((cert) => (
              <div key={cert.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{cert.courseName}</h3>
                  <p className="text-sm text-gray-500 mb-4">{cert.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Student:</span> {cert.studentName}</p>
                    <p className="text-sm"><span className="font-medium">Completed:</span> {new Date(cert.completionDate).toLocaleDateString()}</p>
                    <p className="text-sm">
                      <span className="font-medium">Token ID:</span>{' '}
                      <a 
                        href={`https://hashscan.io/testnet/token/${cert.tokenId}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline"
                      >
                        {cert.tokenId}
                      </a>
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-4">
                  <button className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </button>
                  <a href={cert.ipfsUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-900 flex items-center text-sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    View Document
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
