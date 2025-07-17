import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  gradient?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export const MetricsCard = ({ 
  title, 
  value, 
  description, 
  icon, 
  gradient = "from-blue-500 to-indigo-600",
  trend = 'neutral',
  trendValue 
}: MetricsCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600 dark:text-green-400';
      case 'down': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      default: return '📊';
    }
  };

  return (
    <Card className="relative overflow-hidden bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group">
      {/* Gradient background overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {title}
          </CardTitle>
          {trendValue && (
            <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
              <span>{getTrendIcon()}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <div className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-slate-900 dark:group-hover:text-white transition-colors duration-300">
          {value}
        </div>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};