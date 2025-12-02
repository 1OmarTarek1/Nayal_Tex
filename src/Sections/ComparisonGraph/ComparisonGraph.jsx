import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useInventoryStore from '../../store/inventoryStore';
import './ComparisonGraph.css';

/**
 * Graph comparing products added vs removed over time
 */
const ComparisonGraph = () => {
  const transactions = useInventoryStore(state => state.transactions);

  // Combine added and removed by MONTH
  const getComparisonData = () => {
    const dataByMonth = {};

    transactions.forEach(tx => {
      const d = new Date(tx.date);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // Format: YYYY-MM

      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = { added: 0, removed: 0 };
      }
      if (tx.type === 'add') {
        dataByMonth[monthKey].added += tx.amount;
      } else if (tx.type === 'remove') {
        dataByMonth[monthKey].removed += tx.amount;
      }
    });

    // Convert to array and sort by date
    return Object.entries(dataByMonth)
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        return {
          date: `${month}/${year}`, // Format: MM/YYYY for display
          ...data,
          fullDate: monthKey
        };
      })
      .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
      .slice(-5); // Last 5 months
  };

  const data = getComparisonData();

  if (data.length === 0) {
    return (
      <div className="noDataMessage">
        <p>لا توجد بيانات للمقارنة بعد</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="var(--DT-borderLight)" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fill: "var(--DT-text)", fontSize: 11 }}
        />
        <YAxis
          tick={{ fill: "var(--DT-text)", fontSize: 11 }}
          tickMargin={25}
          width={35}
        />
        <Tooltip
          contentStyle={{ background: "var(--DT-component)", color: "var(--DT-text)" }}
          formatter={(value) => `${value} وحدة`}
        />
        <Legend wrapperStyle={{ color: "var(--DT-text)" }} />
        <Line
          type="monotone"
          dataKey="added"
          stroke="#4CAF50"
          name="المضافة"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="removed"
          stroke="#F44336"
          name="المباعة"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComparisonGraph;
