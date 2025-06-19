import React from 'react';
import { Heart, Facebook, ExternalLink } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>About This Site</span>
            </h3>
            <p className="text-slate-400 leading-relaxed">
              The most comprehensive discography site for Ilse DeLange and The Common Linnets. 
              Featuring detailed album information, complete lyrics, and extensive visual documentation 
              of one of the Netherlands' most beloved country artists.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              <a href="/albums" className="text-slate-400 hover:text-white transition-colors">Albums</a>
              <a href="/lyrics" className="text-slate-400 hover:text-white transition-colors">Lyrics</a>
              <a href="/artist/ilse-delange" className="text-slate-400 hover:text-white transition-colors">Ilse DeLange</a>
              <a href="/artist/the-common-linnets" className="text-slate-400 hover:text-white transition-colors">The Common Linnets</a>
            </div>
          </div>

          {/* Connect Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">Connect</h3>
            <div className="space-y-3">
              <a 
                href="http://www.facebook.com/ilsedelangerecords" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-slate-400 hover:text-white transition-colors group"
              >
                <Facebook className="w-5 h-5 group-hover:text-blue-500" />
                <span>Follow on Facebook</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <p className="text-sm text-slate-500">
                Stay updated with the latest releases and news
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-slate-500">
            © 2025 Ilse DeLange Records Discography. Fan-maintained archive.
          </div>
          <div className="text-sm text-slate-500">
            Migrated with ❤️ to modern web technologies
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

