import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useInventoryStore from '../../store/inventoryStore';
import './ProductAddedGraph.css';

/**
 * Graph showing products added over time (daily aggregation)
 */
const ProductAddedGraph = () => {
  const transactions = useInventoryStore(state => state.transactions);

  // Filter only ADD transactions and aggregate by MONTH
  const getAddedData = () => {
    const addedByMonth = {};

    transactions
      .filter(tx => tx.type === 'add')
      .forEach(tx => {
        const d = new Date(tx.date);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; // Format: YYYY-MM
        addedByMonth[monthKey] = (addedByMonth[monthKey] || 0) + tx.amount;
      });

    // Convert to array and sort by date
    return Object.entries(addedByMonth)
      .map(([monthKey, amount]) => {
        const [year, month] = monthKey.split('-');
        return {
          date: `${month}/${year}`, // Format: MM/YYYY for display
          added: amount,
          fullDate: monthKey
        };
      })
      .sort((a, b) => a.fullDate.localeCompare(b.fullDate))
      .slice(-5); // Last 5 months
  };

  const data = getAddedData();

  if (data.length === 0) {
    return (
      <div className="noDataMessage">
        <p>لا توجد بيانات للمنتجات المضافة بعد</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 25, left: 0, bottom: 0 }}
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
          cursor={{ fill: "rgba(76, 175, 80, 0.15)" }}
          formatter={(value) => `${value} وحدة`}
        />
        <Legend wrapperStyle={{ color: "var(--DT-text)" }} />
        <Bar
          dataKey="added"
          fill="#4CAF50"
          name="المنتجات المضافة"
          barSize={35}
          radius={[6, 6, 0, 0]}
          activeBar={{
            stroke: "var(--DT-bg)",
            strokeWidth: 2
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ProductAddedGraph;
