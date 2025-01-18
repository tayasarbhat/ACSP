import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { ActivationData } from '../types';

interface ActivationsTableProps {
  data: ActivationData[];
  showDateColumn?: boolean;
  isMasterSheet?: boolean;
}

export function ActivationsTable({ data, showDateColumn = false, isMasterSheet = false }: ActivationsTableProps) {
  return (
    <div className="overflow-hidden bg-white rounded-xl">
      <div className="overflow-x-auto max-h-[600px] relative">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-blue-500 to-indigo-600">
              {showDateColumn && (
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Date</th>
              )}
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Emp ID</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Agent Name</th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                  <span>Silver</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                  <span>Gold</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                  <span>Platinum</span>
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                <div className="flex items-center space-x-1">
                  <span className="w-3 h-3 rounded-full bg-teal-400"></span>
                  <span>Standard</span>
                </div>
              </th>
              {!isMasterSheet && (
                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Total</th>
              )}
              {isMasterSheet && (
                <>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Target</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Achieved</th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Remaining</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 relative">
            {data.map((row, index) => {
              const isTotal = row.empId === 'Total' || row.agentName === 'Total';
              const achievementPercentage = (row.achieved / row.target) * 100;
              const rowClass = isTotal 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 font-bold text-lg border-t-2 border-indigo-100' 
                : index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

              return (
                <tr 
                  key={`${row.empId}-${row.agentName}-${index}`} 
                  className={`${rowClass} hover:bg-blue-50 transition-colors duration-150 ease-in-out`}
                >
                  {showDateColumn && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {row.date || 'Master Sheet'}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.empId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.agentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {row.silver}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {row.gold}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {row.platinum}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                      {row.standard}
                    </span>
                  </td>
                  {!isMasterSheet && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {row.total}
                      </span>
                    </td>
                  )}
                  {isMasterSheet && (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.target}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isTotal ? 'bg-indigo-100 text-indigo-800 text-base px-3 py-1' : achievementPercentage >= 100 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {row.achieved}
                          </span>
                          {!isTotal && (
                            <span className={`ml-2 text-xs ${
                              achievementPercentage >= 100 ? 'text-green-600' : 'text-orange-600'
                            }`}>
                              ({achievementPercentage.toFixed(1)}%)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {row.remaining > 0 ? (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          ) : (
                            <TrendingUp className={`w-4 h-4 ${isTotal ? 'text-indigo-500' : 'text-green-500'}`} />
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isTotal ? 'bg-indigo-100 text-indigo-800 text-base px-3 py-1' : row.remaining > 0 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {Math.abs(row.remaining)}
                          </span>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}