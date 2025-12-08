import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { CustomTooltip } from '../../Components';
import './PizzaGraph.css'

const PizzaGraph = ({ data = [], isAnimationActive = true }) => {
  if (!data || data.length === 0) {
    return (
      <div className="noDataMessage" style={{
        height: 400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--DT-text)',
        background: 'var(--DT-component)',
        borderRadius: '12px'
      }}>
        <p>لا توجد بيانات لتوزيع المبيعات</p>
      </div>
    );
  }

  // Use only outer pie with actual product colors
  const pieData = data.slice(0, 4).map(item => ({
    name: item.name,
    value: item.value,
    color: item.colorCode || '#CCCCCC' // Use actual color code from data
  }));

  // Custom label with contrasting colors
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, fill }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Determine if we need dark or light text based on background color
    const isLightColor = (hexColor) => {
      if (!hexColor) return false;
      const hex = hexColor.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 155;
    };

    const textColor = isLightColor(fill) ? '#000000' : '#FFFFFF';

    return (
      <text
        x={x}
        y={y}
        fill={textColor}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={10}
        fontWeight="bold"
        style={{
          textShadow: isLightColor(fill)
            ? '0px 0px 3px rgba(255,255,255,0.8)'
            : '0px 0px 3px rgba(0,0,0,0.8)'
        }}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          cx="50%"
          cy="50%"
          outerRadius="70%"
          isAnimationActive={isAnimationActive}
          label={renderCustomLabel}
          labelLine={false}
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              stroke="var(--DT-borderLight)"
              strokeWidth={2}
            />
          ))}
        </Pie>

        <Tooltip
          content={
            <CustomTooltip
              type="pie"
              valueFormatter={(value) => `الكمية: ${value} وحدة`}
            />
          }
          cursor={{ fill: 'rgba(255,255,255,0.1)' }}
        />
        <Legend
          wrapperStyle={{ color: 'var(--DT-text)' }}
          formatter={(value, entry) => (
            <span style={{ color: 'var(--DT-text)' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default PizzaGraph;
