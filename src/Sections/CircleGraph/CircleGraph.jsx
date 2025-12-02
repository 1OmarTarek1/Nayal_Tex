import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import './CircleGraph.css';

const CircleGraph = ({ data = [] }) => {
  // Colors for the bars
  const colors = ["#6a34c2", "#9b59b6", "#8e44ad", "#7d3c98", "#9c27b0"];

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
        <p>لا توجد بيانات للأشكال الأكثر مبيعاً</p>
      </div>
    );
  }

  // Calculate total and percentages
  const total = data.reduce((sum, item) => sum + item.uv, 0);

  // Convert to percentages and prepare data
  const chartData = data.map((item, index) => ({
    name: item.name,
    percentage: total > 0 ? parseFloat(((item.uv / total) * 100).toFixed(1)) : 0,
    quantity: item.uv,
    fill: colors[index % colors.length]
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: 'var(--DT-component)',
          border: '1px solid var(--DT-borderLight)',
          padding: '10px 15px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          <p style={{ color: 'var(--DT-text)', margin: 0, fontWeight: 600, marginBottom: '5px' }}>
            {payload[0].payload.name}
          </p>
          <p style={{ color: 'var(--primary2-color)', margin: 0 }}>
            الكمية: {payload[0].payload.quantity} وحدة
          </p>
          <p style={{ color: 'var(--primary2-color)', margin: 0 }}>
            النسبة: {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--DT-borderLight)" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fill: "var(--DT-text)", fontSize: 11 }}
          label={{ value: 'النسبة المئوية (%)', position: 'bottom', fill: 'var(--DT-text)', offset: 0 }}
        />
        <YAxis
          type="category"
          // dataKey="name"
          tick={{ fill: "var(--DT-text)", fontSize: 11 }}
          width={30}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(106, 52, 194, 0.1)' }} />
        <Bar
          dataKey="percentage"
          radius={[0, 8, 8, 0]}
          maxBarSize={35}
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill} />
          ))}
          <LabelList
            dataKey="percentage"
            position="right"
            fill="var(--DT-text)"
            formatter={(value) => `${value}%`}
            style={{ fontSize: 12, fontWeight: 'bold' }}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default CircleGraph;
