import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Globe, 
  Shield, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Leaf className="w-6 h-6" />,
      title: 'Micro-Project Focus',
      description: 'Empowering small-scale environmental initiatives with direct access to carbon markets.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'On-Chain Verification',
      description: 'Transparent, immutable verification using Sui blockchain and real-time data streams.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Impact',
      description: 'Connect local projects with global buyers for maximum environmental and social impact.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Fair Pricing',
      description: 'Direct funding to project developers, eliminating intermediaries and maximizing benefits.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community Driven',
      description: 'Supporting Indigenous communities, smallholder farmers, and local environmental groups.'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Real-Time Data',
      description: 'Digital MRV with satellite imagery, sensors, and community reports for accurate verification.'
    }
  ];

  const stats = [
    { label: 'Projects Supported', value: '500+' },
    { label: 'Carbon Credits Generated', value: '1M+ kg CO2' },
    { label: 'Communities Impacted', value: '50+' },
    { label: 'Countries', value: '25+' }
  ];

  const benefits = [
    'Reduced verification costs by 80%',
    'Direct funding to frontline actors',
    'Real-time impact tracking',
    'Transparent blockchain records',
    'Community co-benefits verification',
    'Automated credit generation'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
            >
              Decentralized Carbon Credits for
              <span className="text-green-600"> Micro-Projects</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
            >
              Transform small-scale environmental projects into verifiable carbon credits. 
              Leverage blockchain technology to democratize access to climate finance.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/marketplace"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Explore Marketplace
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                to="/create-project"
                className="inline-flex items-center px-8 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-colors"
              >
                Start Your Project
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're revolutionizing the carbon credit market by focusing on transparency, 
              accessibility, and real impact for micro-projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-green-600 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Key Benefits for Project Developers
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-lg"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-gray-600 mb-6">
                Join hundreds of micro-projects already generating carbon credits 
                and receiving direct funding for their environmental work.
              </p>
              <Link
                to="/create-project"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
              >
                Create Your Project
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl font-bold text-white mb-4"
          >
            Join the Climate Finance Revolution
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-green-100 mb-8 max-w-2xl mx-auto"
          >
            Whether you're a project developer or a corporate buyer, 
            discover how blockchain can transform climate action.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/marketplace"
              className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Browse Credits
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center px-8 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-green-700 transition-colors"
            >
              Get Started
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 