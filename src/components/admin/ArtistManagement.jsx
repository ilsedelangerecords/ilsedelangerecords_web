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
  User,
  Music,
  Disc
} from 'lucide-react';

const ArtistManagement = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/artists');
      if (!response.ok) throw new Error('Failed to fetch artists');
      const data = await response.json();
      setArtists(data);
    } catch (error) {
      console.error('Error fetching artists:', error);
      setError('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  const deleteArtist = async (artistId) => {
    if (!window.confirm('Are you sure you want to delete this artist? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/artists/${artistId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete artist');
      
      setArtists(artists.filter(artist => artist.id !== artistId));
    } catch (error) {
      console.error('Error deleting artist:', error);
      setError('Failed to delete artist');
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Artists</h2>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading artists...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Artists</h2>
        <Button asChild>
          <Link to="/admin/artists/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Artist
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
              placeholder="Search artists..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtists.map((artist) => (
          <Card key={artist.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-lg">{artist.name}</CardTitle>
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                  >
                    <Link to={`/admin/artists/${artist.id}/edit`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteArtist(artist.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {artist.bio && (
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {artist.bio}
                  </p>
                )}
                
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Disc className="h-4 w-4" />
                      <span>{artist._count?.releases || 0} releases</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Music className="h-4 w-4" />
                      <span>{artist._count?.tracks || 0} tracks</span>
                    </div>
                  </div>
                </div>

                {artist.website && (
                  <div className="pt-2">
                    <a 
                      href={artist.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Visit Website →
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArtists.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? 'No artists found' : 'No artists yet'}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm 
                ? `No artists match "${searchTerm}"`
                : 'Get started by adding your first artist'
              }
            </p>
            {!searchTerm && (
              <Button asChild>
                <Link to="/admin/artists/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Artist
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArtistManagement;
