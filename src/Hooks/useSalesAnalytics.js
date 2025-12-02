import useInventoryStore from '../store/inventoryStore';

/**
 * Hook for analyzing inventory movements and stock levels
 * INVENTORY-ONLY: No financial data, only stock tracking
 */
const useInventoryAnalytics = () => {
    const { curtainTypes, transactions } = useInventoryStore(state => ({
        curtainTypes: state.curtainTypes,
        transactions: state.transactions
    }));

    // --- Helper: Get All Variants Flat ---
    const getAllVariants = () => {
        return curtainTypes.flatMap(type =>
            type.shapes.flatMap(shape =>
                shape.variants.map(variant => ({
                    ...variant,
                    shapeId: shape.id,
                    shapeName: shape.name,
                    typeId: type.id,
                    typeName: type.name
                }))
            )
        );
    };

    const allVariants = getAllVariants();

    // --- KPIs: Inventory Metrics Only ---
    const totalStock = allVariants.reduce((acc, item) => acc + item.inStock, 0);
    const totalDistributed = allVariants.reduce((acc, item) => acc + item.sold, 0); // Items distributed outbound
    const totalItems = allVariants.length; // Number of unique SKUs
    // Calculate Sales This Month
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const totalSalesThisMonth = transactions
        .filter(tx => {
            const txDate = new Date(tx.date);
            return (tx.type === 'remove' || tx.type === 'sell') &&
                txDate.getMonth() === currentMonth &&
                txDate.getFullYear() === currentYear;
        })
        .reduce((acc, tx) => acc + tx.amount, 0);

    const stockTurnoverRate = totalStock > 0 ? (totalSalesThisMonth / totalStock * 100).toFixed(1) : 0;

    // --- Chart 1: Outbound Distribution by Type (Bar Chart - BuildingGraph) ---
    const getOutboundByType = () => {
        const outbound = {};
        curtainTypes.forEach(type => {
            outbound[type.name] = type.shapes.reduce((accShape, shape) => {
                return accShape + shape.variants.reduce((accVar, v) => accVar + v.sold, 0);
            }, 0);
        });
        return Object.entries(outbound).map(([name, value]) => ({ name, value }));
    };

    // --- Chart 2: Distribution by Color (Pie Chart - PizzaGraph) ---
    const getDistributionByColor = () => {
        const colorMap = {};
        allVariants.forEach(v => {
            if (!colorMap[v.name]) {
                colorMap[v.name] = {
                    name: v.name,
                    value: 0,
                    colorCode: v.code // Store the actual hex color
                };
            }
            colorMap[v.name].value += v.sold;
        });
        return Object.values(colorMap)
            .sort((a, b) => b.value - a.value);
    };

    // --- Chart 3: Top Distributed Shapes (Radial/Circle Graph) ---
    // Top 5 shapes by outbound quantity
    const getTopDistributedShapes = () => {
        const shapeStats = {};
        allVariants.forEach(v => {
            const key = `${v.typeName} - ${v.shapeName}`;
            if (!shapeStats[key]) shapeStats[key] = { name: key, distributed: 0, stock: 0 };
            shapeStats[key].distributed += v.sold;
            shapeStats[key].stock += v.inStock;
        });

        return Object.values(shapeStats)
            .sort((a, b) => b.distributed - a.distributed)
            .slice(0, 5)
            .map(item => ({
                name: item.name,
                uv: item.distributed, // for radial chart
                pv: item.stock,
                fill: '#8884d8' // placeholder, will be overridden
            }));
    };

    // --- Chart 4: Monthly Movement Trend (Area/Wave Graph) ---
    // Tracks outbound movements over time
    const getMonthlyMovement = () => {
        if (transactions.length === 0) return [];

        const movementByMonth = {};
        transactions
            .filter(tx => tx.type === 'remove' || tx.type === 'sell') // outbound transactions
            .forEach(tx => {
                const date = new Date(tx.date);
                const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
                movementByMonth[key] = (movementByMonth[key] || 0) + tx.amount;
            });

        return Object.entries(movementByMonth)
            .map(([name, uv]) => ({ name, uv }))
            .sort((a, b) => {
                const [m1, y1] = a.name.split('/').map(Number);
                const [m2, y2] = b.name.split('/').map(Number);
                return y1 - y2 || m1 - m2;
            })
            .slice(-5); // Last 5 months
    };

    // --- Chart 5: Radar Analysis (Stock vs Distribution Balance) ---
    // Compare types on inventory metrics
    const getRadarData = () => {
        return curtainTypes.map(type => {
            const totalStock = type.shapes.reduce((acc, s) => acc + s.variants.reduce((a, v) => a + v.inStock, 0), 0);
            const totalDistributed = type.shapes.reduce((acc, s) => acc + s.variants.reduce((a, v) => a + v.sold, 0), 0);

            return {
                subject: type.name,
                A: totalStock,          // Current Stock Level
                B: totalDistributed,    // Total Outbound Quantity
                fullMark: Math.max(totalStock, totalDistributed) * 1.2
            };
        });
    };

    return {
        kpis: {
            totalStock,
            totalDistributed,
            totalItems,
            stockTurnoverRate
        },
        charts: {
            outboundByType: getOutboundByType(),
            distributionByColor: getDistributionByColor(),
            topShapes: getTopDistributedShapes(),
            monthlyMovement: getMonthlyMovement(),
            radarStats: getRadarData()
        }
    };
};

export default useInventoryAnalytics;
