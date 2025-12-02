import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import './WaveGraph.css';

const WaveGraph = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="noDataMessage" style={{
        height: 350,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--DT-text)',
        background: 'var(--DT-component)',
        borderRadius: '12px'
      }}>
        <p>لا توجد بيانات مبيعات شهرية حتى الآن</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="var(--DT-borderLight)" strokeDasharray="3 3" />
        <XAxis dataKey="name" tick={{ fill: "var(--DT-text)", fontSize: 11 }} />
        <YAxis tick={{ fill: "var(--DT-text)", fontSize: 11 }} tickMargin={25} width={35} />
        <Tooltip
          contentStyle={{ background: "var(--DT-component)", color: "var(--DT-text)" }}
          cursor={{ fill: "rgba(106, 52, 194, 0.15)" }} // ظل بنفسجي شفاف عند hover
        />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="var(--primary2-color)"   // اللون البنفسجي
          fill="rgba(106, 52, 194, 0.3)"  // تعبئة شبه شفافة بنفسجي فاتح
          name="المبيعات الشهرية"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default WaveGraph;
