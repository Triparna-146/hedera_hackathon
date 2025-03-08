import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import Layout from '../components/Layout';
import { Shield, Award, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const { connectWallet } = useWallet();
  const navigate = useNavigate();

  const handleConnect = async () => {
    await connectWallet();
    navigate('/dashboard');
  };

  return (
    <Layout showNav={false}>
      <div className="text-center">
        <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Decentralized Certificate Platform
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          Issue and verify certificates securely on the Hedera blockchain
        </p>
        <div className="mt-10">
          <button
            onClick={handleConnect}
            className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Connect HashPack Wallet
          </button>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center">
              <Shield className="h-12 w-12 text-indigo-600" />
              <h3 className="mt-6 text-lg font-semibold">Secure</h3>
              <p className="mt-2 text-gray-600">
                Certificates are stored securely on the Hedera blockchain
              </p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="h-12 w-12 text-indigo-600" />
              <h3 className="mt-6 text-lg font-semibold">Verifiable</h3>
              <p className="mt-2 text-gray-600">
                Instantly verify the authenticity of any certificate
              </p>
            </div>
            <div className="flex flex-col items-center">
              <CheckCircle className="h-12 w-12 text-indigo-600" />
              <h3 className="mt-6 text-lg font-semibold">Trusted</h3>
              <p className="mt-2 text-gray-600">
                Built on reliable blockchain technology
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}