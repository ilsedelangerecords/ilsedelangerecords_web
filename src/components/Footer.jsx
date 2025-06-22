import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Heart, Github, Mail, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About Section */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Ilse DeLange Records Archive
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              A fan-maintained archive dedicated to preserving the musical legacy of 
              Ilse DeLange and The Common Linnets. This community-driven project 
              celebrates their artistry and makes their discography accessible to fans worldwide.
            </p>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/ilsedelangerecords/ilsedelangerecords_web"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5 mr-2" />
                GitHub
              </a>
              <a
                href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/edit/main/src/components/Footer.jsx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-gray-300 hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Edit Footer
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/albums" className="text-gray-300 hover:text-white transition-colors">
                  Albums & Singles
                </Link>
              </li>
              <li>
                <Link to="/lyrics" className="text-gray-300 hover:text-white transition-colors">
                  Song Lyrics
                </Link>
              </li>
              <li>
                <Link to="/artist/ilse-delange" className="text-gray-300 hover:text-white transition-colors">
                  Ilse DeLange
                </Link>
              </li>
              <li>
                <Link to="/artist/the-common-linnets" className="text-gray-300 hover:text-white transition-colors">
                  The Common Linnets
                </Link>
              </li>
            </ul>
          </div>          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contribute" className="text-gray-300 hover:text-white transition-colors">
                  Contribute
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Report Issues
                </a>
              </li>
              <li>
                <Link to="/disclaimer" className="text-gray-300 hover:text-white transition-colors">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              <p className="mb-1">
                © 2025 Ilse DeLange Records Archive. Fan-maintained project.
              </p>
              <p>
                All music and lyrics remain the property of their respective copyright holders.
              </p>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-gray-400">Built with</span>
              <span className="text-red-500">❤️</span>
              <span className="text-gray-400">by fans, for fans</span>
            </div>
          </div>
          
          {/* Technical Info */}
          <div className="mt-4 pt-4 border-t border-gray-800 text-center text-xs text-gray-500">
            <p>
              Open source project • React + TypeScript • 
              <a 
                href="https://github.com/ilsedelangerecords/ilsedelangerecords_web" 
                className="ml-1 text-blue-400 hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                View source code
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

