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
import './BuildingGraph.css';

const BuildingGraph = ({ data = [] }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{ top: 10, right: 25, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} tickMargin={25} width={35} />
        <Tooltip cursor={{ fill: "rgba(200, 200, 200, 0.41)" }} />
        <Legend />
        <Bar
          dataKey="value"
          fill="var(--primary2-color)"        // اللون الأساسي البنفسجي
          name="المباع"
          barSize={35}
          radius={[6, 6, 0, 0]}             // حواف ناعمة
          activeBar={{
            stroke: "var(--DT-bg)",          // عند hover أو active
            strokeWidth: 2
          }}
        />

        <CartesianGrid stroke="var(--DT-borderLight)" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "var(--DT-text)", fontSize: 11 }} />
        <YAxis tick={{ fill: "var(--DT-text)", fontSize: 11 }} tickMargin={25} width={35} />
        <Tooltip
          contentStyle={{ background: "var(--DT-component)", color: "var(--DT-text)" }}
          cursor={{ fill: "rgba(106, 52, 194,0.15)" }} // ظل بنفسجي شفاف عند hover
        />
        <Legend wrapperStyle={{ color: "var(--DT-text)" }} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BuildingGraph;
