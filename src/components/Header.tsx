'use client';

import { Settings, Map } from 'lucide-react';
import { useState } from 'react';
import PreferencesModal from './PreferencesModal';

export default function Header() {
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">MakanWhere</h1>
        
        <div className="flex items-center gap-4">
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Open map"
          >
            <Map className="w-6 h-6 text-gray-600" />
          </button>
          <button 
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setShowPreferences(true)}
            aria-label="Open preferences"
          >
            <Settings className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {showPreferences && (
          <PreferencesModal
            preferences={{
              budget: 'modest',
              dietary: { halal: false, vegetarian: false },
              hungerLevel: 'normal',
              favoriteTypes: [],
              avoidTypes: []
            }}
            onSave={(prefs) => {
              console.log('Saved preferences:', prefs);
              setShowPreferences(false);
            }}
            onClose={() => setShowPreferences(false)}
          />
        )}
      </div>
    </header>
  );
}