import React from 'react';

const MiniBarChart = ({ data, maxHeight = 60, barWidth = 20, spacing = 4 }) => {
  if (!data || data.length === 0) return null;

  // Find the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.percentage));

  return (
    <div className="flex items-end space-x-1" style={{ height: `${maxHeight}px` }}>
      {data.map((item, index) => {
        const barHeight = (item.percentage / maxValue) * maxHeight;
        const color = getBarColor(index);
        
        return (
          <div
            key={index}
            className="flex flex-col items-center"
            style={{ width: `${barWidth}px` }}
          >
            <div className="relative flex flex-col items-center">
              {/* Bar */}
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: color,
                  minHeight: '2px'
                }}
              />
              
              {/* Percentage label on top of bar */}
              <div 
                className="text-xs font-medium text-gray-700 absolute -top-4 whitespace-nowrap"
                style={{ fontSize: '10px' }}
              >
                {item.percentage}%
              </div>
            </div>
            
            {/* Category label below bar */}
            <div 
              className="text-xs text-gray-600 text-center mt-1 truncate w-full"
              style={{ fontSize: '9px', lineHeight: '1.2' }}
              title={item.category}
            >
              {item.category.length > 8 ? 
                item.category.substring(0, 8) + '...' : 
                item.category
              }
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to get consistent bar colors
const getBarColor = (index) => {
  const colors = [
    '#dc2626', // red
    '#ea580c', // orange  
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899'  // pink
  ];
  return colors[index % colors.length];
};

export default MiniBarChart;
