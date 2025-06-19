import React from 'react';
import { ExternalLink, Shield, Users, Heart, Mail, Globe } from 'lucide-react';

const DisclaimerPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Disclaimer & Legal Information</h1>
              <p className="mt-2 text-gray-600">
                Important information about this fan-maintained archive
              </p>
            </div>
            
            {/* GitHub Edit Button */}
            <a
              href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/edit/main/src/components/pages/DisclaimerPage.jsx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Edit on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          
          {/* Fan Archive Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Heart className="w-6 h-6 text-blue-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h2 className="text-lg font-semibold text-blue-900 mb-2">Fan-Maintained Archive</h2>
                <p className="text-blue-800">
                  This website is a fan-created and community-maintained archive dedicated to preserving 
                  the musical legacy of Ilse DeLange and The Common Linnets. It is not officially 
                  affiliated with the artists, their management, or record labels.
                </p>
              </div>
            </div>
          </div>

          {/* Copyright Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2" />
              Copyright & Intellectual Property
            </h2>
            
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Music & Lyrics</h3>
              <p className="text-gray-700 mb-4">
                All songs, lyrics, and musical compositions featured on this website remain the 
                intellectual property of their respective copyright holders, including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Ilse DeLange and her representatives</li>
                <li>The Common Linnets and their representatives</li>
                <li>Record labels and publishers</li>
                <li>Songwriters and composers</li>
                <li>Other credited artists and collaborators</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Images & Artwork</h3>
              <p className="text-gray-700 mb-4">
                Album artwork, promotional photos, and other visual materials are the property 
                of their respective copyright holders. These materials are used here for 
                educational and archival purposes under fair use provisions.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Website Content</h3>
              <p className="text-gray-700 mb-4">
                The compilation, organization, and presentation of information on this website, 
                as well as any original commentary or analysis, is the work of volunteer 
                contributors and is made available under open source principles.
              </p>
            </div>
          </section>

          {/* Fair Use Statement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Fair Use Statement</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                This website operates under the principles of fair use for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Educational:</strong> Providing information about musical works and artists</li>
                <li><strong>Archival:</strong> Preserving cultural and artistic heritage</li>
                <li><strong>Research:</strong> Supporting academic and journalistic research</li>
                <li><strong>Commentary:</strong> Enabling critical discussion and analysis</li>
                <li><strong>Non-commercial:</strong> No profit is derived from this archive</li>
              </ul>
            </div>
          </section>

          {/* Community Guidelines */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Community Guidelines
            </h2>
            
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Respectful Use</h3>
              <p className="text-gray-700 mb-4">
                Users of this website are expected to:
              </p>
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-1">
                <li>Respect the intellectual property rights of all copyright holders</li>
                <li>Use content for personal, educational, or research purposes only</li>
                <li>Not redistribute or republish content for commercial purposes</li>
                <li>Provide proper attribution when referencing this archive</li>
                <li>Report any inaccuracies or copyright concerns</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Content Accuracy</h3>
              <p className="text-gray-700 mb-4">
                While we strive for accuracy, this is a volunteer-maintained archive. 
                Information may contain errors or omissions. Users are encouraged to 
                verify information through official sources when accuracy is critical.
              </p>
            </div>
          </section>

          {/* DMCA & Takedown Policy */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">DMCA & Content Removal</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                If you are a copyright holder and believe that content on this website 
                infringes your rights, please contact us immediately. We will respond 
                promptly to valid takedown requests.
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Contact for copyright concerns:</strong>
              </p>
              <div className="flex items-center text-gray-700">
                <Mail className="w-4 h-4 mr-2" />
                <span>Create an issue on our GitHub repository</span>
              </div>
            </div>
          </section>

          {/* Technical Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Globe className="w-6 h-6 mr-2" />
              Technical Information
            </h2>
            
            <div className="prose prose-gray max-w-none">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Open Source</h3>
              <p className="text-gray-700 mb-4">
                This website is built using open source technologies and the source code 
                is available on GitHub. The technical implementation is separate from 
                the copyrighted content it displays.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Data Collection</h3>
              <p className="text-gray-700 mb-4">
                This website does not collect personal information or use tracking cookies. 
                Standard web server logs may be maintained for technical purposes only.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Accessibility</h3>
              <p className="text-gray-700 mb-4">
                We strive to make this archive accessible to all users. If you encounter 
                accessibility issues, please report them through our GitHub repository.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact & Contributions</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-700 mb-4">
                This archive is maintained by volunteers who are passionate about preserving 
                musical heritage. We welcome contributions, corrections, and feedback.
              </p>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  <a 
                    href="https://github.com/ilsedelangerecords/ilsedelangerecords_web" 
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub Repository
                  </a>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Community contributions welcome</span>
                </div>
              </div>
            </div>
          </section>

          {/* Last Updated */}
          <div className="border-t pt-6 text-center text-sm text-gray-500">
            <p>Last updated: June 2025</p>
            <p>This disclaimer may be updated periodically to reflect changes in the project or legal requirements.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerPage;

