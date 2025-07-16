// Analytics utilities for generating realistic dummy data and calculations

export interface ProgressData {
  day: string;
  submissions: number;
  evaluations: number;
}

export interface AnalyticsMetrics {
  totalSubmissions: number;
  totalEvaluations: number;
  averageDaily: number;
  growthRate: number;
  bestDay: string;
  efficiency: number;
}

// Generate realistic data patterns based on time of week/month/year
export const generateRealisticData = (timeFrame: 'weekly' | 'monthly' | 'yearly'): ProgressData[] => {
  const baseVariation = 0.3; // 30% variation from base values
  
  switch (timeFrame) {
    case 'weekly':
      const weeklyBase = [
        { day: "Mon", baseSubmissions: 6, baseEvaluations: 4 },
        { day: "Tue", baseSubmissions: 8, baseEvaluations: 6 },
        { day: "Wed", baseSubmissions: 7, baseEvaluations: 8 },
        { day: "Thu", baseSubmissions: 9, baseEvaluations: 5 },
        { day: "Fri", baseSubmissions: 6, baseEvaluations: 7 },
        { day: "Sat", baseSubmissions: 3, baseEvaluations: 2 },
        { day: "Sun", baseSubmissions: 4, baseEvaluations: 3 },
      ];
      
      return weeklyBase.map(item => ({
        day: item.day,
        submissions: Math.max(1, Math.floor(item.baseSubmissions * (1 + (Math.random() - 0.5) * baseVariation))),
        evaluations: Math.max(1, Math.floor(item.baseEvaluations * (1 + (Math.random() - 0.5) * baseVariation))),
      }));

    case 'monthly':
      const monthlyBase = [
        { day: "Week 1", baseSubmissions: 35, baseEvaluations: 28 },
        { day: "Week 2", baseSubmissions: 42, baseEvaluations: 35 },
        { day: "Week 3", baseSubmissions: 38, baseEvaluations: 40 },
        { day: "Week 4", baseSubmissions: 33, baseEvaluations: 30 },
      ];
      
      return monthlyBase.map(item => ({
        day: item.day,
        submissions: Math.max(10, Math.floor(item.baseSubmissions * (1 + (Math.random() - 0.5) * baseVariation))),
        evaluations: Math.max(10, Math.floor(item.baseEvaluations * (1 + (Math.random() - 0.5) * baseVariation))),
      }));

    case 'yearly':
      const yearlyBase = [
        { day: "Jan", baseSubmissions: 120, baseEvaluations: 100 },
        { day: "Feb", baseSubmissions: 110, baseEvaluations: 95 },
        { day: "Mar", baseSubmissions: 135, baseEvaluations: 115 },
        { day: "Apr", baseSubmissions: 130, baseEvaluations: 110 },
        { day: "May", baseSubmissions: 145, baseEvaluations: 125 },
        { day: "Jun", baseSubmissions: 140, baseEvaluations: 120 },
        { day: "Jul", baseSubmissions: 125, baseEvaluations: 105 }, // Summer break effect
        { day: "Aug", baseSubmissions: 130, baseEvaluations: 110 },
        { day: "Sep", baseSubmissions: 155, baseEvaluations: 135 }, // New semester boost
        { day: "Oct", baseSubmissions: 150, baseEvaluations: 130 },
        { day: "Nov", baseSubmissions: 140, baseEvaluations: 120 },
        { day: "Dec", baseSubmissions: 115, baseEvaluations: 100 }, // End of year decline
      ];
      
      return yearlyBase.map(item => ({
        day: item.day,
        submissions: Math.max(50, Math.floor(item.baseSubmissions * (1 + (Math.random() - 0.5) * baseVariation))),
        evaluations: Math.max(50, Math.floor(item.baseEvaluations * (1 + (Math.random() - 0.5) * baseVariation))),
      }));

    default:
      return [];
  }
};

// Calculate analytics metrics from data
export const calculateAnalytics = (data: ProgressData[], activeView: 'submissions' | 'evaluations'): AnalyticsMetrics => {
  const values = data.map(item => activeView === 'submissions' ? item.submissions : item.evaluations);
  const total = values.reduce((sum, val) => sum + val, 0);
  const average = total / data.length;
  
  // Find best performing day
  const maxIndex = values.indexOf(Math.max(...values));
  const bestDay = data[maxIndex]?.day || 'N/A';
  
  // Calculate growth rate (last value vs first value)
  const growthRate = data.length > 1 ? 
    ((values[values.length - 1] - values[0]) / values[0] * 100) : 0;
  
  // Calculate efficiency (ratio of evaluations to submissions)
  const totalSubmissions = data.reduce((sum, item) => sum + item.submissions, 0);
  const totalEvaluations = data.reduce((sum, item) => sum + item.evaluations, 0);
  const efficiency = totalSubmissions > 0 ? (totalEvaluations / totalSubmissions * 100) : 0;
  
  return {
    totalSubmissions: data.reduce((sum, item) => sum + item.submissions, 0),
    totalEvaluations: data.reduce((sum, item) => sum + item.evaluations, 0),
    averageDaily: Math.round(average * 10) / 10,
    growthRate: Math.round(growthRate * 10) / 10,
    bestDay,
    efficiency: Math.round(efficiency * 10) / 10,
  };
};

// Generate trending insights
export const generateInsights = (data: ProgressData[], timeFrame: string): string[] => {
  const analytics = calculateAnalytics(data, 'submissions');
  const insights: string[] = [];
  
  if (analytics.growthRate > 10) {
    insights.push(`📈 Great momentum! ${analytics.growthRate}% growth this ${timeFrame.slice(0, -2)}`);
  } else if (analytics.growthRate < -10) {
    insights.push(`📉 Consider reviewing your ${timeFrame.slice(0, -2)} strategy`);
  }
  
  if (analytics.efficiency > 80) {
    insights.push(`⚡ Excellent evaluation efficiency at ${analytics.efficiency}%`);
  } else if (analytics.efficiency < 50) {
    insights.push(`🎯 Focus on completing more evaluations`);
  }
  
  insights.push(`🏆 Peak performance on ${analytics.bestDay}`);
  
  if (analytics.averageDaily > 5) {
    insights.push(`🔥 Consistent daily activity with ${analytics.averageDaily} avg submissions`);
  }
  
  return insights;
};
