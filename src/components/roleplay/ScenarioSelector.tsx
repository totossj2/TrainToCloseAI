import React from 'react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: string;
  userRole: string;
  aiRole: string;
  initialPrompt: string;
}

interface ScenarioSelectorProps {
  scenarios: Scenario[];
  selectedScenario: Scenario;
  onSelect: (scenario: Scenario) => void;
}

const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({ 
  scenarios, 
  selectedScenario, 
  onSelect 
}) => {
  const [filter, setFilter] = React.useState('all');
  
  const filteredScenarios = filter === 'all' 
    ? scenarios 
    : scenarios.filter(s => s.category === filter || s.difficulty === filter);
  
  const categories = Array.from(new Set(scenarios.map(s => s.category)));
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Scenario</h3>
      
      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <FilterButton 
            label="All" 
            value="all" 
            currentFilter={filter} 
            onClick={() => setFilter('all')} 
          />
          {categories.map(category => (
            <FilterButton 
              key={category}
              label={category} 
              value={category} 
              currentFilter={filter} 
              onClick={() => setFilter(category)} 
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {difficulties.map(difficulty => (
            <FilterButton 
              key={difficulty}
              label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
              value={difficulty} 
              currentFilter={filter} 
              onClick={() => setFilter(difficulty)} 
              isSmall
            />
          ))}
        </div>
      </div>
      
      <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
        {filteredScenarios.map(scenario => (
          <ScenarioCard 
            key={scenario.id}
            scenario={scenario}
            isSelected={selectedScenario.id === scenario.id}
            onClick={() => onSelect(scenario)}
          />
        ))}
      </div>
    </div>
  );
};

const FilterButton = ({ 
  label, 
  value, 
  currentFilter, 
  onClick,
  isSmall = false
}: { 
  label: string; 
  value: string; 
  currentFilter: string; 
  onClick: () => void;
  isSmall?: boolean;
}) => (
  <button
    onClick={onClick}
    className={`${isSmall ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'} rounded-full ${
      currentFilter === value 
        ? 'bg-indigo-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    } transition-colors duration-200`}
  >
    {label}
  </button>
);

const ScenarioCard = ({ 
  scenario, 
  isSelected, 
  onClick 
}: { 
  scenario: Scenario; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-amber-100 text-amber-800',
    expert: 'bg-red-100 text-red-800'
  };
  
  return (
    <div 
      onClick={onClick}
      className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'bg-indigo-50 border-2 border-indigo-500' 
          : 'bg-white border border-gray-200 hover:border-indigo-300'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900">{scenario.title}</h4>
        <span className={`text-xs px-2 py-0.5 rounded-full ${difficultyColors[scenario.difficulty]}`}>
          {scenario.difficulty.charAt(0).toUpperCase() + scenario.difficulty.slice(1)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{scenario.description}</p>
      <div className="flex items-center text-xs text-gray-500">
        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{scenario.category}</span>
      </div>
    </div>
  );
};

export default ScenarioSelector;