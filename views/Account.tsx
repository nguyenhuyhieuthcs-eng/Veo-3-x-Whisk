
import React from 'react';
import Button from '../components/Button';
import { CreditCard, LifeBuoy, CheckCircle, MessageSquare } from 'lucide-react';

const Account: React.FC = () => {

  const handleSupportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Support message sent! (Mock response)');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-light-text">Account & Services</h1>
      
      {/* Account Status Card */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center"><CreditCard className="mr-3 text-brand-blue" /> Account Status</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <span className="font-medium text-medium-text">Connected Account</span>
            <div className="flex items-center space-x-2">
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google Logo" className="h-6 bg-white p-1 rounded-md" />
                <span className="text-light-text">user@googleultra.com</span>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <span className="font-medium text-medium-text">Subscription Plan</span>
            <span className="text-light-text font-semibold">Whisk + Veo3 Combo</span>
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
            <span className="font-medium text-medium-text">Generation Credits</span>
            <div className="flex items-center text-green-400 font-bold">
              <CheckCircle size={20} className="mr-2"/>
              <span>Unlimited</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Support Card */}
      <div className="bg-dark-card border border-dark-border rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6 flex items-center"><LifeBuoy className="mr-3 text-brand-purple" /> 24/7 Support</h2>
        <p className="text-medium-text mb-6">Have a question or need assistance? Our support team is here to help you around the clock.</p>
        <form onSubmit={handleSupportSubmit} className="space-y-4">
          <select 
            className="w-full p-3 bg-dark-bg border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none"
            defaultValue=""
            required
          >
            <option value="" disabled>Select a topic...</option>
            <option value="billing">Billing Issue</option>
            <option value="technical">Technical Problem</option>
            <option value="feedback">Feedback & Suggestions</option>
            <option value="other">Other</option>
          </select>
          <textarea
            placeholder="Describe your issue here..."
            className="w-full h-32 p-3 bg-dark-bg border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-purple focus:outline-none"
            required
          ></textarea>
          <Button type="submit" variant="primary" icon={<MessageSquare size={18} />}>
            Send Message
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Account;
