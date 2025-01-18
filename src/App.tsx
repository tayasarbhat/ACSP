import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Award, Target, TrendingUp, ArrowDownToLine, Gem, Shield, Users } from 'lucide-react';
import { DashboardCard } from './components/DashboardCard';
import { DateSelector } from './components/DateSelector';
import { SearchInput } from './components/SearchInput';
import { ActivationsTable } from './components/ActivationsTable';
import { fetchSheetData, parseSheetData, fetchSheetList } from './utils/sheets';
import type { ActivationData } from './types';

function App() {
  const [data, setData] = useState<ActivationData[]>([]);
  const [monthlyData, setMonthlyData] = useState<Record<string, ActivationData[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState('Master Sheet');
  const [searchQuery, setSearchQuery] = useState('');

  const loadMonthlyData = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    try {
      const sheets = await fetchSheetList();
      const dailySheets = sheets.filter(sheet => sheet.name !== 'Master Sheet');
      
      const allData: Record<string, ActivationData[]> = {};
      await Promise.all(
        dailySheets.map(async (sheet) => {
          const rawData = await fetchSheetData(sheet.name);
          const parsedData = parseSheetData(rawData);
          allData[sheet.date] = parsedData;
        })
      );
      
      setMonthlyData(allData);
    } catch (error) {
      setError('Failed to load monthly data. Please try again later.');
      console.error('Failed to load monthly data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const rawData = await fetchSheetData(selectedDate);
      const parsedData = parseSheetData(rawData);
      setData(parsedData);
    } catch (err) {
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  // Load data when date changes or search is cleared
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true);
      loadMonthlyData();
    } else if (selectedDate === 'Master Sheet') {
      setMonthlyData({});
      setLoading(false);
    }
  }, [searchQuery, loadMonthlyData]);

  const filteredData = useMemo(() => {
    const searchTerm = searchQuery.trim().toLowerCase();
    if (!searchTerm) {
      return data.filter(row => row.agentName !== 'Total' && row.empId !== 'Total');
    }
    
    const currentData = data.filter(row => 
      row.agentName.toLowerCase().includes(searchTerm) &&
      row.agentName !== 'Total'
    );

    if (Object.keys(monthlyData).length === 0) {
      return currentData;
    }
    
    // Get the agent names that match the search
    const matchingAgents = currentData.map(row => row.agentName);

    // Create daily entries for matching agents
    const dailyEntries = Object.entries(monthlyData)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .flatMap(([date, dayData]) => {
        return dayData
          .filter(row => 
            matchingAgents.includes(row.agentName) && 
            row.agentName !== 'Total'
          )
          .map(row => ({
            ...row,
            date
          }));
      });

    return dailyEntries.length > 0 ? dailyEntries : currentData;
  }, [data, monthlyData, searchQuery]);

  const calculateTotals = (data: ActivationData[]) => {
    const totals = data.reduce((acc, row) => ({
      silver: acc.silver + row.silver,
      gold: acc.gold + row.gold,
      platinum: acc.platinum + row.platinum,
      standard: acc.standard + row.standard,
      total: acc.total + row.total,
      target: acc.target + row.target,
      achieved: acc.achieved + row.achieved,
      remaining: acc.remaining + row.remaining
    }), {
      silver: 0,
      gold: 0,
      platinum: 0,
      standard: 0,
      total: 0,
      target: 0,
      achieved: 0,
      remaining: 0
    });

    return {
      ...totals,
      remaining: totals.target - totals.achieved
    };
  };

  const totals = useMemo(() => calculateTotals(data), [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activations Dashboard</h1>
              <p className="mt-2 text-gray-600">January 2025 Performance Overview</p>
            </div>
            <div className="flex items-center gap-4">
              <SearchInput value={searchQuery} onChange={setSearchQuery} />
              <DateSelector selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Target"
            value={totals.target}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            icon={<Target size={24} />}
          />
          <DashboardCard
            title="Achieved"
            value={totals.achieved}
            color="bg-gradient-to-br from-green-500 to-green-600"
            icon={<TrendingUp size={24} />}
          />
          <DashboardCard
            title="Remaining"
            value={totals.remaining}
            color={`bg-gradient-to-br ${totals.remaining > 0 ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600'}`}
            color={`bg-gradient-to-br ${
              totals.remaining > 0 ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600'
            }`}
            icon={<ArrowDownToLine size={24} />}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Silver Activations"
            value={totals.silver}
            color="bg-gradient-to-br from-gray-500 to-gray-600"
            icon={<Award size={24} />}
          />
          <DashboardCard
            title="Gold Activations"
            value={totals.gold}
            color="bg-gradient-to-br from-yellow-500 to-yellow-600"
            icon={<Gem size={24} />}
          />
          <DashboardCard
            title="Platinum Activations"
            value={totals.platinum}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
            icon={<Shield size={24} />}
          />
          <DashboardCard
            title="Standard Activations"
            value={totals.standard}
            color="bg-gradient-to-br from-teal-500 to-teal-600"
            icon={<Users size={24} />}
          />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Performance</h2>
          <ActivationsTable 
            data={filteredData} 
            showDateColumn={searchQuery.trim().length > 0}
            isMasterSheet={selectedDate === 'Master Sheet' && !searchQuery.trim()}
          />
        </div>
      </div>
    </div>
  );
}

export default App;