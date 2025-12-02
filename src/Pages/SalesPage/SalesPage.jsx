import { DynamicNav, MainContainer } from '../../Layouts';
import { BuildingGraph, CircleGraph, PizzaGraph, WaveGraph, ProductAddedGraph, ProductRemovedGraph, ComparisonGraph } from '../../Sections';
import RadarGraph from '../../Sections/RadarGraph/RadarGraph';
import useInventoryAnalytics from '../../hooks/useSalesAnalytics';
import InventoryKPIs from '../../Components/InventoryKPIs/InventoryKPIs';

import './SalesPage.css';

const SalesPage = () => {
  const { kpis, charts } = useInventoryAnalytics();

  return (
    <>
      {/* <DynamicNav className={"salesPageNav"} title={"المبيعات والإحصائيات"} /> */}
      <MainContainer>
        <div className="PAGE salesPage">
          {/* KPI Dashboard */}
          <InventoryKPIs kpis={kpis} />

          {/* Container 1: Products In/Out and Comparison */}
          <div className="graphContainer">
            <div className="graphGrid twoColumns">
              <section className="graphSection">
                <h3 className="sectionTitle">المنتجات المضافة</h3>
                <ProductAddedGraph />
              </section>

              <section className="graphSection">
                <h3 className="sectionTitle">المنتجات الصادرة</h3>
                <ProductRemovedGraph />
              </section>
            </div>

            <section className="graphSection">
              <h3 className="sectionTitle">مقارنة الإضافات والصادرات</h3>
              <ComparisonGraph />
            </section>
          </div>

          {/* Container 2: Distribution by Type and Color */}
          <div className="graphContainer" style={{ flexDirection: "row" }}>
            <section className="graphSection" style={{ flex: "2" }}>
              <h3 className="sectionTitle">التوزيع حسب النوع</h3>
              <BuildingGraph data={charts.outboundByType} />
            </section>

            <section className="graphSection" style={{ flex: "1" }}>
              <h3 className="sectionTitle">التوزيع حسب اللون</h3>
              <PizzaGraph data={charts.distributionByColor} />
            </section>
          </div>

          {/* Container 3: Top Shapes and Radar Comparison */}
          <div className="graphContainer" style={{ flexDirection: "row" }}>
            <section className="graphSection" style={{ flex: 1 }}>
              <h3 className="sectionTitle">مقارنة المخزون والتوزيع حسب النوع</h3>
              <RadarGraph data={charts.radarStats} />
            </section>

            <section className="graphSection" style={{ flex: 2 }}>
              <h3 className="sectionTitle">أكثر 5 أشكال توزيعاً</h3>
              <CircleGraph data={charts.topShapes} />
            </section>
          </div>

          {/* Monthly Movement - Full Width */}
          <section className="graphSection">
            <h3 className="sectionTitle">الحركة الشهرية</h3>
            <WaveGraph data={charts.monthlyMovement} />
          </section>
        </div>
      </MainContainer>
    </>
  );
};

export default SalesPage;
