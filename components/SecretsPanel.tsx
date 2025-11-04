
import React from 'react';

export const SecretsPanel: React.FC = () => {
  const mockSecrets = [
    { name: 'DOCKER_USERNAME', updated: '3 days ago' },
    { name: 'NPM_TOKEN', updated: '2 weeks ago' },
    { name: 'STAGING_AWS_KEY', updated: '1 month ago' },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Repository Secrets</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md text-sm">
          New repository secret
        </button>
      </div>
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <ul>
          {mockSecrets.map((secret, index) => (
            <li key={secret.name} className={`flex justify-between items-center p-4 ${index < mockSecrets.length - 1 ? 'border-b border-gray-700' : ''}`}>
              <div>
                <p className="font-mono text-white">{secret.name}</p>
                <p className="text-sm text-gray-400">Updated {secret.updated}</p>
              </div>
              <button className="text-sm text-blue-400 hover:underline">
                Update
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
