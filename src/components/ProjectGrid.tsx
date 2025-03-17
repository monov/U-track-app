import React, { memo, useEffect, useState, FC } from 'react';
import Toggle from '@jetbrains/ring-ui-built/components/toggle/toggle';
import Text from '@jetbrains/ring-ui-built/components/text/text';
import '@jetbrains/ring-ui-built/components/style.css';
import './ProjectGrid.css';

interface Project {
    iconUrl: string | null;
    name: string;
    $type: string;
    archived: boolean;
    id: string;
}

//Repeating myself here, I could avoid it if I did that in a separate file...

interface ProjectListProps {
    projects: Project[];
    host: any;
}

interface ProjectCardProps {
    project: Project;
    isArchived: boolean;
    onToggle: (project: Project) => void;
}


const ProjectCard: FC<ProjectCardProps> = ({ project, isArchived, onToggle }) => (
  <div className={`project-card ${isArchived ? 'active' : ''}`}>
    <div className="project-card-content">
      <div className="project-icon">
        {project.iconUrl ? (
          <img src={project.iconUrl} alt={`${project.name} icon`}/>
                ) : (
                  <div className="project-icon-placeholder">
                    {project.name.charAt(0).toUpperCase()} {/*just in case*/}
                  </div>
                )}
      </div>
      <div className="project-info">
        <Text className="project-name">{project.name}</Text>
        <Text className="project-type">{project.$type}</Text>
      </div>
      <div className="project-toggle">
        <Toggle
          data-id={project.id}
          checked={isArchived}
          onChange={() => onToggle(project)}
        />
      </div>
    </div>
  </div>
);


const ProjectGridComponent: React.FC<ProjectListProps> = ({ projects, host }) => {
    // project ID as key in toggleState
    const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({});


    useEffect(() => {
        const initialStates: Record<string, boolean> = {};
        projects.forEach(project => {
            initialStates[project.id] = project.archived;
        });
        setToggleStates(initialStates);
    }, [projects]);


    const handleToggle = async (project: Project) => {
        const currentState = toggleStates[project.id];
        const newArchivedStatus = !currentState;

        setToggleStates(prev => ({
            ...prev,
            [project.id]: newArchivedStatus,
        }));

        try {
            await host.fetchYouTrack(`admin/projects/${project.id}`, {
                method: 'POST',
                body: { archived: newArchivedStatus },
            });
        } catch (error) {
            console.error('Failed to update project status:', error);
            // Revert
            setToggleStates(prev => ({
                ...prev,
                [project.id]: currentState,
            }));
        }
    };

    return (
      <div className="project-grid-container">
        <div className="project-grid">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              isArchived={toggleStates[project.id] || false}
              onToggle={handleToggle}
            />
                ))}
        </div>
      </div>
    );
};

export const ProjectGrid = memo(ProjectGridComponent);
