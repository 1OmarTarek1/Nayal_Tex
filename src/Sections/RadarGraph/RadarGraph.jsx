import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './RadarGraph.css'

const RadarGraph = ({ data = [] }) => {
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
        <p>لا توجد بيانات للتحليل الراداري</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', minHeight: 400 }}>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>

          {/* الخطوط الداخلية الدائرية */}
          <PolarGrid stroke="var(--DT-nestedComponent)" />

          {/* الخطوط اللي طالعة من المركز لكل محور */}
          <PolarAngleAxis
            dataKey="subject"
            stroke="var(--primary2-color)"
            tick={{ fill: "var(--DT-secText)", fontSize: 12 }}
          />

          {/* المدرج الدائري والخط اللي على الأرقام */}
          <PolarRadiusAxis
            stroke="var(--primary2-color)"    // هذا الخط أصبح أوضح
            tick={{ fill: "var(--DT-secText)", fontSize: 12 }}
          />

          {/* الـ Radar نفسه */}
          <Radar
            name="المخزون"
            dataKey="A"
            stroke="var(--primary2-color)"  // آخر خط خارجي
            fill="var(--primary2-color)"
            fillOpacity={0.4}
          />

          <Radar
            name="المبيعات"
            dataKey="B"
            stroke="#4CAF50"
            fill="#4CAF50"
            fillOpacity={0.3}
          />

          {/* Tooltip */}
          <Tooltip contentStyle={{ background: 'var(--DT-component)', color: 'var(--primary2-color)' }} />

        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RadarGraph;
