import './InventoryKPIs.css';

const InventoryKPIs = ({ kpis }) => {
    const {
        totalStock = 0,
        totalDistributed = 0,
        totalItems = 0,
        stockTurnoverRate = 0
    } = kpis || {};

    return (
        <div className="inventory-kpis">
            <div className="kpi-card">
                <div className="kpi-icon">📦</div>
                <div className="kpi-content">
                    <h4 className="kpi-label">إجمالي المخزون</h4>
                    <p className="kpi-value">{totalStock.toLocaleString()}</p>
                    <span className="kpi-unit">وحدة</span>
                </div>
            </div>

            <div className="kpi-card">
                <div className="kpi-icon">📤</div>
                <div className="kpi-content">
                    <h4 className="kpi-label">إجمالي الصادرات</h4>
                    <p className="kpi-value">{totalDistributed.toLocaleString()}</p>
                    <span className="kpi-unit">وحدة</span>
                </div>
            </div>

            <div className="kpi-card">
                <div className="kpi-icon">🏷️</div>
                <div className="kpi-content">
                    <h4 className="kpi-label">عدد الأصناف</h4>
                    <p className="kpi-value">{totalItems}</p>
                    <span className="kpi-unit">صنف</span>
                </div>
            </div>

            <div className="kpi-card">
                <div className="kpi-icon">📊</div>
                <div className="kpi-content">
                    <h4 className="kpi-label">معدل الدوران</h4>
                    <p className="kpi-value">{stockTurnoverRate}%</p>
                    <span className="kpi-unit">كفاءة</span>
                </div>
            </div>
        </div>
    );
};

export default InventoryKPIs;
