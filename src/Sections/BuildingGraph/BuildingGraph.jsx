import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { CustomTooltip } from '../../Components';
import './BuildingGraph.css';

const BuildingGraph = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 25, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="var(--DT-borderLight)" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "var(--DT-text)", fontSize: 11 }} />
        <YAxis tick={{ fill: "var(--DT-text)", fontSize: 11 }} tickMargin={25} width={35} />
        <Tooltip
          content={
            <CustomTooltip
              type="bar"
              valueFormatter={(value) => `${value} وحدة`}
            />
          }
          cursor={{ fill: "rgba(106, 52, 194,0.15)" }}
        />
        <Legend wrapperStyle={{ color: "var(--DT-text)" }} />
        <Bar
          dataKey="value"
          fill="var(--primary2-color)"
          name="المباع"
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

export default BuildingGraph;
