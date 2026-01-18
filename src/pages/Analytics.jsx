import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import ImpactCard from '../components/analytics/ImpactCard';
import { useAnalyticsStore } from '../store/analyticsStore';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import { motion } from 'framer-motion';

export default function Analytics() {
  const { impact, streak, loading, fetchImpact, fetchStreak } = useAnalyticsStore();
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    fetchImpact();
    fetchStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Generate enhanced weekly data with more details
    const generateWeeklyData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const colors = [
        "from-teal-500 to-cyan-500",
        "from-amber-500 to-yellow-500", 
        "from-blue-500 to-indigo-500",
        "from-green-500 to-emerald-500",
        "from-purple-500 to-pink-500",
        "from-orange-500 to-red-500",
        "from-indigo-500 to-purple-500"
      ];
      
      // Generate realistic donation data
      const baseValues = [4, 6, 3, 8, 5, 7, 2];
      const expandedData = days.map((day, index) => {
        const value = baseValues[index];
        const meals = value * 3; // Each donation averages 3 meals
        const co2 = value * 0.8; // Each donation saves ~0.8kg CO2
        const waste = value * 2.5; // Each donation prevents ~2.5kg waste
        
        return {
          day,
          value,
          meals,
          co2,
          waste,
          color: colors[index],
          trend: index > 0 ? (value > baseValues[index - 1] ? 'up' : 'down') : 'neutral',
          peak: value === Math.max(...baseValues),
          low: value === Math.min(...baseValues)
        };
      });
      
      setWeeklyData(expandedData);
    };
    
    generateWeeklyData();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <div className="max-w-7xl mx-auto p-8">
        <LoadingSkeleton count={3} />
      </div>
    </div>
  );

  // Calculate totals from weekly data
  const weeklyTotals = weeklyData.reduce((totals, day) => ({
    donations: totals.donations + day.value,
    meals: totals.meals + day.meals,
    co2: totals.co2 + day.co2,
    waste: totals.waste + day.waste
  }), { donations: 0, meals: 0, co2: 0, waste: 0 });

  const maxVal = weeklyData.length > 0 ? Math.max(...weeklyData.map(w => w.value)) : 0;
  const avgDonations = weeklyData.length > 0 ? (weeklyTotals.donations / 7).toFixed(1) : 0;

  // Demo data for fallback
  const demoImpact = {
    mealsSaved: 1247,
    co2Saved: 324
  };

  const displayImpact = impact && impact.mealsSaved ? impact : demoImpact;
  const displayStreak = streak || 28;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 py-8">
      <style jsx>{`
        @keyframes barGrow {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        
        .bar-grow {
          transform-origin: bottom;
          animation: barGrow 0.8s ease-out;
        }
        
        .peak-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              📊 Impact Analytics
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Track your contribution to fighting hunger and reducing food waste
            </p>
          </div>

          {/* Impact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <ImpactCard 
              title="Meals Shared" 
              value={displayImpact.mealsSaved ? displayImpact.mealsSaved.toLocaleString() : "0"} 
              icon="🍽️" 
              bgColor="bg-gradient-to-br from-green-500 to-emerald-500" 
              textColor="text-white" 
            />
            <ImpactCard 
              title="CO₂ Saved" 
              value={displayImpact.co2Saved ? `${displayImpact.co2Saved}kg` : "0kg"} 
              icon="🌱" 
              bgColor="bg-gradient-to-br from-teal-500 to-cyan-500" 
              textColor="text-white" 
            />
            <ImpactCard 
              title="Current Streak" 
              value={`${displayStreak} days`} 
              icon="🔥" 
              bgColor="bg-gradient-to-br from-amber-500 to-orange-500" 
              textColor="text-white" 
            />
          </div>

          {/* Weekly Activity Chart */}
          <Card title="📈 Weekly Activity" className="border-0 shadow-2xl mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-100 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Your Weekly Contributions</h3>
                  <p className="text-gray-600 text-sm">Daily donation activity overview</p>
                </div>
                <div className="text-sm font-medium text-teal-600 bg-white/50 px-3 py-1 rounded-full">
                  Total: {weeklyTotals.donations} donations • {weeklyTotals.meals} meals
                </div>
              </div>
            </div>
            
            {/* Weekly Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 mb-6">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Avg Daily</div>
                <div className="text-lg font-bold text-gray-800">{avgDonations}</div>
                <div className="text-xs text-gray-500">donations/day</div>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Meals Impact</div>
                <div className="text-lg font-bold text-gray-800">{weeklyTotals.meals}</div>
                <div className="text-xs text-gray-500">meals shared</div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">CO₂ Saved</div>
                <div className="text-lg font-bold text-gray-800">{weeklyTotals.co2.toFixed(1)}kg</div>
                <div className="text-xs text-gray-500">carbon reduced</div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                <div className="text-sm text-gray-600">Waste Prevented</div>
                <div className="text-lg font-bold text-gray-800">{weeklyTotals.waste.toFixed(1)}kg</div>
                <div className="text-xs text-gray-500">from landfill</div>
              </div>
            </div>
            
            {/* Chart Bars */}
            <div className="h-48 flex items-end justify-between gap-4 px-4 pb-4">
              {weeklyData.map((w, index) => (
                <motion.div 
                  key={w.day} 
                  className="flex-1 text-center group relative"
                  initial={{ opacity: 0, scaleY: 0 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Bar Container */}
                  <div className="relative h-full flex flex-col justify-end">
                    {/* Bar Value Display */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 whitespace-nowrap">
                      <div className="font-bold">{w.value} donations</div>
                      <div className="text-gray-300 text-xs">
                        {w.meals} meals • {w.co2.toFixed(1)}kg CO₂
                      </div>
                    </div>
                    
                    {/* Bar */}
                    <div className="relative">
                      <div 
                        className={`bg-gradient-to-t ${w.color} rounded-t-xl transition-all duration-300 group-hover:brightness-110 cursor-pointer relative overflow-hidden bar-grow ${
                          w.peak ? 'peak-pulse shadow-lg' : ''
                        }`}
                        style={{ height: `${(w.value / maxVal) * 80}%` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent"></div>
                        {w.peak && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                            PEAK
                          </div>
                        )}
                        {w.low && (
                          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 text-xs font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                            REST
                          </div>
                        )}
                      </div>
                      
                      {/* Trend Indicator */}
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        {w.trend === 'up' && (
                          <motion.div
                            animate={{ y: [0, -2, 0] }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            className="text-green-500"
                          >
                            ↗
                          </motion.div>
                        )}
                        {w.trend === 'down' && (
                          <div className="text-red-500">↘</div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Day Label */}
                  <div className="mt-3 text-sm font-medium text-gray-700">
                    {w.day}
                    {w.peak && (
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Value */}
                  <div className={`text-xs font-bold ${
                    w.peak ? 'text-yellow-600' : 
                    w.low ? 'text-blue-600' : 
                    'text-gray-500'
                  }`}>
                    {w.value}
                  </div>
                  
                  {/* Mini Meal Indicator */}
                  <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex justify-center gap-0.5">
                      {[...Array(Math.min(w.value, 5))].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-green-500 rounded-full"></div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Chart Legend */}
            <div className="px-4 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded"></div>
                    <span>Donations per day</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Peak day</span>
                  </div>
                </div>
                <div className="font-medium text-gray-700">
                  Weekly total: {weeklyTotals.donations} donations ({weeklyTotals.meals} meals)
                </div>
              </div>
              
              {/* Progress Indicator */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Week Progress</span>
                  <span>{((weeklyTotals.donations / 35) * 100).toFixed(0)}% of goal</span>
                </div>
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(weeklyTotals.donations / 35) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Badges Section */}
          <Card title="🏆 Achievement Badges" className="border-0 shadow-2xl">
            <div className="bg-gradient-to-r from-amber-50 to-orange-100 -mx-6 -mt-6 mb-6 px-6 py-4 rounded-t-2xl border-b border-amber-200">
              <h3 className="text-xl font-bold text-gray-800">Your Accomplishments</h3>
              <p className="text-gray-600 text-sm">Celebrate your food sharing journey</p>
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { name: "First Donor", color: "from-yellow-400 to-amber-500", icon: "🎯" },
                { name: "10 Meals Club", color: "from-green-400 to-emerald-500", icon: "🌟" },
                { name: "Eco Warrior", color: "from-teal-400 to-cyan-500", icon: "🌍" },
                { name: "Community Hero", color: "from-purple-400 to-pink-500", icon: "🦸" },
                { name: "Consistent Giver", color: "from-blue-400 to-indigo-500", icon: "📅" },
                { name: "Food Safety Pro", color: "from-red-400 to-orange-500", icon: "🧪" },
              ].map((badge, index) => (
                <motion.div
                  key={badge.name}
                  className="flex flex-col items-center p-4"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${badge.color} flex items-center justify-center text-white text-2xl shadow-lg mb-2`}>
                    {badge.icon}
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">{badge.name}</span>
                </motion.div>
              ))}
            </div>
          </Card>

          {/* Impact Summary */}
          <motion.div 
            className="mt-12 p-8 bg-gradient-to-r from-teal-500 to-amber-500 rounded-2xl text-center text-white shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold mb-4">🌟 Making a Real Difference</h3>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              Every meal you share helps fight hunger and reduce environmental impact. 
              Together, we're building a more sustainable and compassionate community.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}