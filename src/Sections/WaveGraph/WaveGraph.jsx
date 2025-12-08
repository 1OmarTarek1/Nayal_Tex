import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { CustomTooltip } from '../../Components';
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
          content={
            <CustomTooltip
              type="area"
              valueFormatter={(value) => `${value} وحدة`}
            />
          }
          cursor={{ fill: "rgba(106, 52, 194, 0.15)" }}
        />
        <Area
          type="monotone"
          dataKey="uv"
          stroke="var(--primary2-color)"
          fill="rgba(106, 52, 194, 0.3)"
          name="المبيعات الشهرية"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default WaveGraph;
