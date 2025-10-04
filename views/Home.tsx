
import React from 'react';
import type { Page } from '../types';
import Button from '../components/Button';
import { Award, Infinity, Tv, Users, Wand2, Zap } from 'lucide-react';

interface HomeProps {
  setActivePage: (page: Page) => void;
}

const FeatureCard: React.FC<{ icon: React.ReactElement; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="bg-dark-card border border-dark-border rounded-xl p-6 flex flex-col items-start hover:border-brand-blue transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-3 bg-gray-800 rounded-lg mb-4 text-brand-blue">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-light-text mb-2">{title}</h3>
        <p className="text-sm text-medium-text">{description}</p>
    </div>
);

const Home: React.FC<HomeProps> = ({ setActivePage }) => {
  const features = [
    {
      icon: <Zap size={24} />,
      title: 'Whisk Unlimited',
      description: 'Generate endless character-consistent images with our state-of-the-art image AI.',
    },
    {
      icon: <Tv size={24} />,
      title: 'Veo3 Video Creator',
      description: 'Bring your ideas to life with high-quality, AI-powered video creation from simple prompts.',
    },
    {
      icon: <Wand2 size={24} />,
      title: 'Character Consistency',
      description: 'Maintain character appearance across all your generated images and videos effortlessly.',
    },
    {
      icon: <Infinity size={24} />,
      title: 'Unlimited Generations',
      description: 'Unleash your creativity with no limits on image or video generations.',
    },
    {
      icon: <Award size={24} />,
      title: '4K Quality',
      description: 'Export your creations in stunning 4K resolution, ready for any professional use case.',
    },
    {
      icon: <Users size={24} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated round-the-clock support team.',
    },
  ];

  return (
    <div className="animate-fade-in space-y-12">
      <section className="text-center py-16 px-4 rounded-2xl bg-gradient-to-br from-dark-card to-transparent">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-purple animate-gradient-x">
          Whisk + Veo3 Combo
        </h1>
        <p className="text-xl text-medium-text max-w-3xl mx-auto mb-8">
          The ultimate AI-powered toolkit for creators. Generate stunning, consistent images and cinematic videos with unlimited access and 4K quality.
        </p>
        <div className="flex justify-center gap-4">
          <Button variant="primary" onClick={() => setActivePage('whisk')}>
            Start Creating Images
          </Button>
          <Button variant="secondary" onClick={() => setActivePage('veo')}>
            Generate a Video
          </Button>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
