import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

const ArtistForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id && id !== 'new');

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchArtist = async () => {
    if (!isEditing) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/artists/${id}`);
      if (!response.ok) throw new Error('Failed to fetch artist');
      
      const artist = await response.json();
      setFormData({
        name: artist.name || '',
        bio: artist.bio || '',
        website: artist.website || '',
        socialLinks: artist.socialLinks ? JSON.parse(artist.socialLinks) : {
          facebook: '',
          twitter: '',
          instagram: '',
          youtube: ''
        }
      });
    } catch (error) {
      console.error('Error fetching artist:', error);
      setError('Failed to load artist data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Artist name is required');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        name: formData.name.trim(),
        bio: formData.bio.trim() || null,
        website: formData.website.trim() || null,
        socialLinks: Object.values(formData.socialLinks).some(v => v.trim()) 
          ? formData.socialLinks 
          : null
      };

      const url = isEditing ? `/api/artists/${id}` : '/api/artists';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save artist');
      }

      navigate('/admin/artists');
    } catch (error) {
      console.error('Error saving artist:', error);
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.startsWith('socialLinks.')) {
      const socialField = field.replace('socialLinks.', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  useEffect(() => {
    fetchArtist();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/admin/artists')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Artists
          </Button>
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Artist' : 'Add Artist'}
          </h2>
        </div>
        <div className="text-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p className="text-gray-600">Loading artist data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => navigate('/admin/artists')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Artists
        </Button>
        <h2 className="text-2xl font-bold text-gray-900">
          {isEditing ? 'Edit Artist' : 'Add Artist'}
        </h2>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Artist Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter artist name"
                required
              />
            </div>

            <div>
              <Label htmlFor="bio">Biography</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Enter artist biography"
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.socialLinks.facebook}
                onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                placeholder="https://facebook.com/artist"
              />
            </div>

            <div>
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                placeholder="https://twitter.com/artist"
              />
            </div>

            <div>
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.socialLinks.instagram}
                onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                placeholder="https://instagram.com/artist"
              />
            </div>

            <div>
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={formData.socialLinks.youtube}
                onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                placeholder="https://youtube.com/artist"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/admin/artists')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Artist' : 'Create Artist'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ArtistForm;
