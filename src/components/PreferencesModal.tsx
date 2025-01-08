import { useState } from 'react';
import { UserPreferences } from '@/lib/types';

interface PreferencesModalProps {
  preferences: UserPreferences;
  onSave: (preferences: UserPreferences) => void;
  onClose: () => void;
}

export default function PreferencesModal({ 
  preferences, 
  onSave, 
  onClose 
}: PreferencesModalProps) {
  const [form, setForm] = useState<UserPreferences>(preferences);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Your Preferences</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block mb-2">Budget</label>
            <select 
              className="w-full p-2 border rounded"
              value={form.budget}
              onChange={(e) => setForm({
                ...form,
                budget: e.target.value as UserPreferences['budget']
              })}
            >
              <option value="simple">Simple (💰)</option>
              <option value="modest">Modest (💰💰)</option>
              <option value="extravagant">Extravagant (💰💰💰)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Dietary Preferences</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.dietary.halal}
                  onChange={(e) => setForm({
                    ...form,
                    dietary: { ...form.dietary, halal: e.target.checked }
                  })}
                  className="mr-2"
                />
                Halal
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.dietary.vegetarian}
                  onChange={(e) => setForm({
                    ...form,
                    dietary: { ...form.dietary, vegetarian: e.target.checked }
                  })}
                  className="mr-2"
                />
                Vegetarian
              </label>
            </div>
          </div>

          <div>
            <label className="block mb-2">How hungry are you?</label>
            <select 
              className="w-full p-2 border rounded"
              value={form.hungerLevel}
              onChange={(e) => setForm({
                ...form,
                hungerLevel: e.target.value as UserPreferences['hungerLevel']
              })}
            >
              <option value="light">Just a bit hungry</option>
              <option value="normal">Normal hungry</option>
              <option value="very hungry">Very hungry!</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
}