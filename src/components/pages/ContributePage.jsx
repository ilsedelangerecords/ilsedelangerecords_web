import React from 'react';
import { ExternalLink, Users, Heart, Code, GitBranch, FileText, MessageSquare, Star, AlertCircle } from 'lucide-react';

const ContributePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Contribute to the Archive</h1>
              <p className="mt-2 text-gray-600">
                Help us preserve and improve this musical heritage
              </p>
            </div>
            
            {/* GitHub Edit Button */}
            <a
              href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/edit/main/src/components/pages/ContributePage.jsx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Edit on GitHub
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg p-8 mb-8">
          <div className="flex items-start">
            <Heart className="w-8 h-8 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Join Our Community</h2>
              <p className="text-lg mb-4">
                This archive exists thanks to passionate fans and volunteers who believe in 
                preserving musical heritage. Your contributions, no matter how small, help 
                make this resource better for everyone.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://github.com/ilsedelangerecords/ilsedelangerecords_web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-md hover:bg-gray-100 transition-colors font-medium"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on GitHub
                </a>
                <a
                  href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border-2 border-white text-white rounded-md hover:bg-white hover:text-green-600 transition-colors font-medium"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Report Issues
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ways to Contribute */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          
          {/* Content Contributions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <FileText className="w-6 h-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Content Contributions</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Help improve the accuracy and completeness of our archive.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Correct album information, track listings, or release dates</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Verify and improve song lyrics accuracy</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Add missing albums, singles, or collaborations</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Contribute high-quality album artwork</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Provide additional artist information or biographies</span>
              </li>
            </ul>
          </div>

          {/* Technical Contributions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Code className="w-6 h-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Technical Contributions</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Help improve the website's functionality and user experience.
            </p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Fix bugs or improve existing features</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Enhance mobile responsiveness</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Improve accessibility features</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Add new search and filtering capabilities</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Optimize performance and loading times</span>
              </li>
            </ul>
          </div>
        </div>

        {/* How to Contribute */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <GitBranch className="w-6 h-6 mr-3" />
            How to Contribute
          </h2>

          <div className="space-y-6">
            {/* For Non-Technical Users */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">For Content Contributors (No Coding Required)</h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>
                    <strong>Report Issues:</strong> Use the "Edit on GitHub" button on any page to suggest changes
                  </li>
                  <li>
                    <strong>Create Issues:</strong> Visit our{' '}
                    <a 
                      href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/issues" 
                      className="text-blue-600 hover:text-blue-800"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub Issues page
                    </a>{' '}
                    to report problems or suggest improvements
                  </li>
                  <li>
                    <strong>Provide Information:</strong> Include as much detail as possible (sources, corrections, etc.)
                  </li>
                  <li>
                    <strong>Community Review:</strong> Other contributors will review and implement your suggestions
                  </li>
                </ol>
              </div>
            </div>

            {/* For Technical Users */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">For Technical Contributors</h3>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <ol className="list-decimal list-inside space-y-2 text-gray-700">
                  <li>
                    <strong>Fork the Repository:</strong> Create your own copy of the project on GitHub
                  </li>
                  <li>
                    <strong>Clone Locally:</strong> Download the code to your computer
                  </li>
                  <li>
                    <strong>Make Changes:</strong> Edit content files or improve the code
                  </li>
                  <li>
                    <strong>Test Changes:</strong> Ensure everything works correctly
                  </li>
                  <li>
                    <strong>Submit Pull Request:</strong> Propose your changes for review
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Content Guidelines */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <AlertCircle className="w-6 h-6 mr-3" />
            Content Guidelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">✅ What We Welcome</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Accurate information with reliable sources</li>
                <li>• High-quality images and album artwork</li>
                <li>• Verified lyrics and song information</li>
                <li>• Constructive improvements and corrections</li>
                <li>• Respectful discussion and collaboration</li>
                <li>• Accessibility and usability improvements</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-red-700 mb-3">❌ What We Don't Accept</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Copyrighted content without permission</li>
                <li>• Unverified or speculative information</li>
                <li>• Personal opinions presented as facts</li>
                <li>• Promotional or commercial content</li>
                <li>• Disrespectful or inappropriate material</li>
                <li>• Changes that break existing functionality</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Technical Setup */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Setup Guide</h2>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Development Environment</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Prerequisites:</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  <li>Node.js 18+ and pnpm package manager</li>
                  <li>Git for version control</li>
                  <li>Text editor (VS Code recommended)</li>
                  <li>GitHub account for contributions</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Quick Start:</h4>
                <div className="bg-gray-800 text-green-400 p-4 rounded-md text-sm font-mono">
                  <div># Clone the repository</div>
                  <div>git clone https://github.com/ilsedelangerecords/ilsedelangerecords_web.git</div>
                  <div className="mt-2"># Install dependencies</div>
                  <div>cd ilsedelangerecords_web && pnpm install</div>
                  <div className="mt-2"># Start development server</div>
                  <div>pnpm run dev</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recognition */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-8 mb-8">
          <div className="flex items-start">
            <Star className="w-8 h-8 mt-1 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-3">Recognition & Thanks</h2>
              <p className="text-lg mb-4">
                All contributors are recognized in our project documentation and commit history. 
                Your efforts help preserve musical heritage for future generations.
              </p>
              <p className="text-base">
                Whether you fix a typo, add an album, or improve the code, every contribution 
                matters and is deeply appreciated by the community.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3" />
            Questions or Need Help?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Getting Started</h3>
              <p className="text-gray-600 mb-4">
                New to contributing? Don't worry! We welcome contributors of all experience levels.
              </p>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Check existing issues for beginner-friendly tasks</li>
                <li>• Ask questions in GitHub discussions</li>
                <li>• Start with small improvements</li>
                <li>• Learn from other contributors' work</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Get Support</h3>
              <div className="space-y-3">
                <a
                  href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  GitHub Discussions
                </a>
                <a
                  href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Report Issues
                </a>
                <a
                  href="https://github.com/ilsedelangerecords/ilsedelangerecords_web/wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation Wiki
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributePage;

