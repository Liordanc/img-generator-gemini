'use client';

import { useState, useEffect } from 'react';
import { modes as defaultModes, Mode, PromptTemplate } from '@/lib/prompts';

interface ModeEditorProps {
  onSelectTemplate: (template: string) => void;
  onModeChange: (modeKey: string) => void;
}

export default function ModeEditor({ onSelectTemplate, onModeChange }: ModeEditorProps) {
  // Use state to manage modes so we can add custom templates
  const [managedModes, setManagedModes] = useState<Record<string, Mode>>({});
  const [selectedMode, setSelectedMode] = useState<string>('image_edit');
  
  // State for the "create new template" form
  const [isCreating, setIsCreating] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [newTemplateContent, setNewTemplateContent] = useState('');

  useEffect(() => {
    // Deep copy the default modes into state on initial render
    // to avoid mutating the original imported object.
    setManagedModes(JSON.parse(JSON.stringify(defaultModes)));
  }, []);

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMode = e.target.value;
    setSelectedMode(newMode);
    onModeChange(newMode); // Notify parent of the change
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim() || !newTemplateContent.trim()) {
        alert('יש למלא שם ותוכן לתבנית.');
        return;
    }

    const newTemplate: PromptTemplate = {
        name: newTemplateName,
        description: newTemplateDesc,
        template: newTemplateContent,
        isCustom: true,
    };
    
    // Create a new copy of the modes state to update it
    const updatedModes = { ...managedModes };
    updatedModes[selectedMode].templates.push(newTemplate);
    
    setManagedModes(updatedModes);
    
    // Reset and close form
    setIsCreating(false);
    setNewTemplateName('');
    setNewTemplateDesc('');
    setNewTemplateContent('');
  };


  const currentMode = managedModes[selectedMode];

  return (
    <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg space-y-4">
      <div>
        <label htmlFor="mode-select" className="block text-sm font-medium text-gray-300 mb-1">
          בחר מצב יצירה
        </label>
        <select
          id="mode-select"
          value={selectedMode}
          onChange={handleModeChange}
          className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {Object.entries(managedModes).map(([key, mode]) => (
            <option key={key} value={key}>
              {mode.name}
            </option>
          ))}
        </select>
      </div>

      {currentMode && (
        <div>
          <h3 className="text-md font-semibold mb-2">תבניות זמינות</h3>
          <div className="space-y-2">
            {currentMode.templates.map((template) => (
              <button
                key={template.name}
                onClick={() => onSelectTemplate(template.template)}
                className="w-full text-right p-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-colors"
              >
                <div className="flex justify-between items-center">
                    <span className="font-semibold">{template.name}</span>
                    {template.isCustom && <span className="text-xs bg-indigo-600 px-2 py-0.5 rounded-full">מותאם אישית</span>}
                </div>
                <p className="text-xs text-gray-400">{template.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="pt-2 border-t border-gray-700">
        {isCreating ? (
             <div className="space-y-3">
                <h3 className="text-md font-semibold">יצירת תבנית חדשה</h3>
                <input type="text" placeholder="שם התבנית" value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"/>
                <input type="text" placeholder="תיאור קצר" value={newTemplateDesc} onChange={e => setNewTemplateDesc(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md"/>
                <textarea placeholder="תוכן הפרומפט..." value={newTemplateContent} onChange={e => setNewTemplateContent(e.target.value)} className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md" rows={3}></textarea>
                <div className="flex gap-2">
                    <button onClick={handleSaveTemplate} className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700">שמור</button>
                    <button onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">בטל</button>
                </div>
             </div>
        ) : (
            <button
                onClick={() => setIsCreating(true)}
                className="w-full p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors text-sm"
            >
                + הוסף תבנית חדשה
            </button>
        )}
      </div>

    </div>
  );
}
