
import React from 'react';

const ActionCard: React.FC<{ name: string; author: string; description: string; logo: string }> = ({ name, author, description, logo }) => (
  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 flex space-x-4 hover:border-blue-500 transition-colors">
    <img src={logo} alt={`${author} logo`} className="w-12 h-12 rounded-full" />
    <div className="flex-1">
      <h3 className="font-bold text-white">{name}</h3>
      <p className="text-sm text-blue-400">By {author}</p>
      <p className="text-sm text-gray-400 mt-2">{description}</p>
    </div>
    <button className="self-start bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-1 px-3 rounded-md">
      Add
    </button>
  </div>
);

export const MarketplacePanel: React.FC = () => {
  const popularActions = [
    {
      name: 'actions/checkout',
      author: 'GitHub',
      description: 'Checks out your repository under $GITHUB_WORKSPACE, so your workflow can access it.',
      logo: 'https://picsum.photos/seed/checkout/48/48'
    },
    {
      name: 'actions/setup-node',
      author: 'GitHub',
      description: 'Set up a Node.js environment by adding node to the PATH.',
      logo: 'https://picsum.photos/seed/node/48/48'
    },
    {
      name: 'docker/build-push-action',
      author: 'Docker',
      description: 'Build and push Docker images with Buildx.',
      logo: 'https://picsum.photos/seed/docker/48/48'
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Marketplace</h2>
      <p className="text-gray-400 mb-6">Find and use actions from the community.</p>
      <input
        type="text"
        placeholder="Search for actions..."
        className="w-full bg-gray-800 border border-gray-700 rounded-md px-4 py-2 mb-6"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {popularActions.map(action => (
          <ActionCard key={action.name} {...action} />
        ))}
      </div>
    </div>
  );
};
