import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Disc, 
  Music, 
  FileText, 
  Download, 
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [artistsRes, releasesRes, songsRes] = await Promise.all([
        fetch('/api/artists'),
        fetch('/api/releases'),
        fetch('/api/songs')
      ]);

      const [artists, releases, songs] = await Promise.all([
        artistsRes.json(),
        releasesRes.json(),
        songsRes.json()
      ]);

      setStats({
        artists: artists.length,
        releases: releases.length,
        songs: songs.length,
        lyrics: songs.filter(song => song.lyrics).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus(null);
    
    try {
      const response = await fetch('/api/export', {
        method: 'POST'
      });
      
      if (response.ok) {
        const result = await response.json();
        setExportStatus({ type: 'success', message: 'Data exported successfully!' });
      } else {
        const error = await response.json();
        setExportStatus({ type: 'error', message: error.error || 'Export failed' });
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus({ type: 'error', message: 'Export failed' });
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Artists',
      value: stats?.artists || 0,
      icon: User,
      description: 'Total number of artists'
    },
    {
      title: 'Releases',
      value: stats?.releases || 0,
      icon: Disc,
      description: 'Albums, singles, and compilations'
    },
    {
      title: 'Songs',
      value: stats?.songs || 0,
      icon: Music,
      description: 'Total number of songs'
    },
    {
      title: 'Lyrics',
      value: stats?.lyrics || 0,
      icon: FileText,
      description: 'Songs with lyrics available'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={fetchStats}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
            Export Data
          </Button>
        </div>
      </div>

      {exportStatus && (
        <Alert className={exportStatus.type === 'success' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          {exportStatus.type === 'success' ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-600" />
          )}
          <AlertDescription className={exportStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {exportStatus.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stat.value}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="border-dashed border-gray-300">
              <CardContent className="p-4 text-center">
                <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <h3 className="font-medium mb-1">Add Artist</h3>
                <p className="text-sm text-gray-500 mb-3">Create a new artist profile</p>
                <Button size="sm" variant="outline" className="w-full">
                  Add Artist
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed border-gray-300">
              <CardContent className="p-4 text-center">
                <Disc className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <h3 className="font-medium mb-1">Add Release</h3>
                <p className="text-sm text-gray-500 mb-3">Create a new album or single</p>
                <Button size="sm" variant="outline" className="w-full">
                  Add Release
                </Button>
              </CardContent>
            </Card>

            <Card className="border-dashed border-gray-300">
              <CardContent className="p-4 text-center">
                <Music className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <h3 className="font-medium mb-1">Add Song</h3>
                <p className="text-sm text-gray-500 mb-3">Create a new song entry</p>
                <Button size="sm" variant="outline" className="w-full">
                  Add Song
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* System Information */}
      <Card>
        <CardHeader>
          <CardTitle>System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <Badge variant="secondary">Development</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Database:</span>
              <span className="font-medium">SQLite (dev.db)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API Server:</span>
              <span className="font-medium">http://localhost:3001</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prisma Studio:</span>
              <a 
                href="http://localhost:5555" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                http://localhost:5555
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
