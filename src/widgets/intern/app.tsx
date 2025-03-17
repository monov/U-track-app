import React, { memo, useCallback, useEffect, useState } from 'react';
import Loader from '@jetbrains/ring-ui-built/components/loader/loader';
import '@jetbrains/ring-ui-built/components/style.css';
import { ProjectGrid } from '../../components/ProjectGrid';

const host = await YTApp.register();

interface Project {
  iconUrl: string | null;
  name: string;
  $type: string;
  archived: boolean;
  id: string;
}

interface ApiProject {
  iconUrl?: string;
  name: string;
  $type?: string;
  archived: boolean;
  id: string;
}

//Ideally Interfaces shouldn't be in this file


const formatProject = (project: ApiProject): Project => ({
  iconUrl: project.iconUrl || null,
  name: project.name,
  $type: project.$type || 'Project',
  archived: project.archived,
  id: project.id,
});

const AppComponent: React.FunctionComponent = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch projects from YouTrack API
   */
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await host.fetchYouTrack('admin/projects', {
        query: { fields: 'name,iconUrl,archived,id' },
      }) as ApiProject[];


      setProjects(result.map(formatProject));
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Failed to load projects. Please refresh the page to try again.');
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchProjects();

  }, [fetchProjects]);


  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <Loader/>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <p>{error}</p>
        </div>
      );
    }

    if (projects.length > 0) {
      return <ProjectGrid projects={projects} host={host}/>;
    }

    return (
      <div className="empty-state">
        <p>No projects found.</p>
      </div>
    );
  };

  return (
    <div className="widget">
      <header className="widget-header">
        <h2>YouTrack Projects</h2>
      </header>
      {renderContent()}
    </div>
  );
};

export const App = memo(AppComponent);
