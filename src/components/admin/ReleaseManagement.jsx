import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Disc,
  Music,
  Calendar,
  User
} from 'lucide-react';

const ReleaseManagement = () => {
  const [releases, setReleases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchReleases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/releases');
      if (!response.ok) throw new Error('Failed to fetch releases');
      const data = await response.json();
      setReleases(data);
    } catch (error) {
      console.error('Error fetching releases:', error);
      setError('Failed to load releases');
    } finally {
      setLoading(false);
    }
  };

  const deleteRelease = async (releaseId) => {
    if (!window.confirm('Are you sure you want to delete this release? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/releases/${releaseId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete release');
      
      setReleases(releases.filter(release => release.id !== releaseId));
    } catch (error) {
      console.error('Error deleting release:', error);
      setError('Failed to delete release');
    }
  };

  useEffect(() => {
    fetchReleases();
  }, []);

  const filteredReleases = releases.filter(release =>
    release.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    release.artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReleaseTypeColor = (type) => {
    switch (type) {
      case 'ALBUM': return 'bg-blue-100 text-blue-800';
      case 'SINGLE': return 'bg-green-100 text-green-800';
      case 'EP': return 'bg-purple-100 text-purple-800';
      case 'COMPILATION': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Releases</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading releases...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Releases</h2>
        <Button asChild>
          <Link to="/admin/releases/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Release
          </Link>
        </Button>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search releases or artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Releases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReleases.map((release) => (
          <Card key={release.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Disc className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-lg">{release.title}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link to={`/admin/releases/${release.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteRelease(release.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{release.artist.name}</span>
                </div>

                {release.releaseDate && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(release.releaseDate).toLocaleDateString()}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <Badge className={getReleaseTypeColor(release.releaseType)}>
                    {release.releaseType}
                  </Badge>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Music className="h-4 w-4" />
                    <span>
                      {release.editions?.reduce((total, edition) => 
                        total + (edition.tracks?.length || 0), 0
                      ) || 0} tracks
                    </span>
                  </div>
                </div>

                {release.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                    {release.description}
                  </p>
                )}

                {release.label && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Label: {release.label.name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredReleases.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <Disc className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No releases found' : 'No releases yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No releases match "${searchTerm}"`
                : 'Get started by adding your first release'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/admin/releases/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Release
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReleaseManagement;
