const ModuleSidebar = ({ modules, currentModuleId, onSelectModule }) => {
  const sortedModules = [...modules].sort((a, b) => 
    (a.content?.orderIndex || 0) - (b.content?.orderIndex || 0)
  );

  return (
    <aside className="smv-sidebar">
      <div className="smv-sidebar-header">
        <h2 className="smv-sidebar-title">Módulos del Curso</h2>
        <p className="smv-sidebar-subtitle">
          {modules.length} módulo{modules.length !== 1 ? 's' : ''} disponible{modules.length !== 1 ? 's' : ''}
        </p>
      </div>
      
      <div className="smv-modules-list">
        {sortedModules.map((mod, index) => {
          const isActive = mod.status === 'ACTIVE';
          const isCurrent = mod.id === currentModuleId;
          
          return (
            <div
              key={mod.id}
              className={`smv-module-card ${isCurrent ? 'smv-module-card--active' : ''} ${!isActive ? 'smv-module-card--inactive' : ''}`}
              onClick={() => isActive && onSelectModule(mod.id)}
              role={isActive ? "button" : undefined}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && isActive) {
                  onSelectModule(mod.id);
                }
              }}
            >
              <h3 className="smv-card-title">
                {mod.content?.name || 'Sin nombre'}
              </h3>
              <div className="smv-card-meta">
                <span className="smv-card-number">
                  #{mod.content?.orderIndex || index + 1}
                </span>
                <span className="smv-card-duration">
                  ⏱ {mod.durationInMinutes} min
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default ModuleSidebar;