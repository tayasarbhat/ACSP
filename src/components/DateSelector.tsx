import React, { useState, useEffect, useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { fetchSheetList } from '../utils/sheets';
import type { SheetInfo } from '../types';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

export function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSheets = useCallback(async () => {
    try {
      const sheetList = await fetchSheetList();
      setSheets(sheetList);
    } catch (error) {
      console.error('Failed to load sheet list:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSheets();
  }, [loadSheets]);

  return (
    <div className="relative inline-block">
      <div className="flex items-center">
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className={`appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 cursor-pointer hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            loading ? 'opacity-50' : ''
          }`}
          disabled={loading}
        >
          <option value="Master Sheet">Master Sheet</option>
          {sheets.map((sheet) => (
            <option key={sheet.name} value={sheet.name}>
              {sheet.date}
            </option>
          ))}
        </select>
        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        {loading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
}