import React, { useState } from 'react';
import Layout from '../components/Layout';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyCertificate() {
  const [transactionId, setTransactionId] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [certificateData, setCertificateData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerificationStatus('loading');

    try {
      const response = await fetch(`http://localhost:3000/verify/${transactionId}`);
      const data = await response.json();

      if (response.ok && data.verified) {
        setCertificateData(data);
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Verify Certificate</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
          <div>
            <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
              Transaction ID or NFT ID
            </label>
            <input
              type="text"
              id="transactionId"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter transaction ID or NFT ID"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={verificationStatus === 'loading'}
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {verificationStatus === 'loading' ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </div>

          {verificationStatus === 'success' && certificateData && (
            <div className="mt-4 p-4 bg-green-50 rounded-md">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700">Certificate verified successfully!</span>
              </div>
              <div className="mt-3 text-sm text-gray-700">
                {/* <a 
                  href={certificateData.metadata.ipfsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Certificate
                </a> */}
              </div>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="mt-4 p-4 bg-red-50 rounded-md flex items-center">
              <XCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">Certificate verification failed. Please check the ID and try again.</span>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
}
