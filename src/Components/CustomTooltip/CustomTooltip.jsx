/**
 * Smart CustomTooltip component that adapts to different chart types
 * Works with Pie, Bar, Line, Area, Radar, and other Recharts components
 */
const CustomTooltip = ({
    active,
    payload,
    label,
    type = 'default', // 'pie', 'bar', 'line', 'default'
    labelFormatter = (label) => label,
    valueFormatter = (value) => `${value} وحدة`,
    showColor = true,
    customContent = null
}) => {
    // Return null if tooltip is not active or has no data
    if (!active || !payload || payload.length === 0) {
        return null;
    }

    // Allow completely custom tooltip content
    if (customContent) {
        return customContent({ active, payload, label });
    }

    // Tooltip base styles
    const tooltipStyle = {
        background: 'var(--DT-component)',
        border: '1px solid var(--DT-borderLight)',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        minWidth: '150px'
    };

    const titleStyle = {
        color: 'var(--DT-text)',
        margin: 0,
        fontWeight: 600,
        marginBottom: '8px',
        fontSize: '13px'
    };

    const itemStyle = {
        color: 'var(--primary2-color)',
        margin: 0,
        marginTop: '4px',
        fontSize: '12px'
    };

    const colorBoxStyle = (color) => ({
        width: '14px',
        height: '14px',
        borderRadius: '3px',
        background: color,
        border: '1px solid var(--DT-borderLight)',
        flexShrink: 0
    });

    // PIE CHART TOOLTIP (single slice)
    if (type === 'pie') {
        const data = payload[0];
        const color = data.payload.color || data.payload.fill || data.color;
        const name = data.name || data.payload.name;
        const value = data.value;

        return (
            <div style={tooltipStyle}>
                {showColor && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <div style={colorBoxStyle(color)}></div>
                        <p style={titleStyle}>{name}</p>
                    </div>
                )}
                {!showColor && <p style={titleStyle}>{name}</p>}
                <p style={itemStyle}>{valueFormatter(value, data)}</p>
            </div>
        );
    }

    // BAR/LINE CHART TOOLTIP (may have multiple values)
    if (type === 'bar' || type === 'line' || type === 'area') {
        return (
            <div style={tooltipStyle}>
                {label && (
                    <p style={titleStyle}>{labelFormatter(label)}</p>
                )}
                {payload.map((entry, index) => {
                    const color = entry.color || entry.fill || entry.stroke;
                    const name = entry.name || entry.dataKey;
                    const value = entry.value;

                    return (
                        <div key={`item-${index}`} style={{ marginTop: index > 0 ? '6px' : '0' }}>
                            {showColor && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                    <div style={colorBoxStyle(color)}></div>
                                    <span style={{ color: 'var(--DT-text)', fontSize: '12px', fontWeight: 500 }}>
                                        {name}
                                    </span>
                                </div>
                            )}
                            <p style={itemStyle}>{valueFormatter(value, entry)}</p>
                        </div>
                    );
                })}
            </div>
        );
    }

    // DEFAULT TOOLTIP (flexible for any chart type)
    return (
        <div style={tooltipStyle}>
            {label && (
                <p style={titleStyle}>{labelFormatter(label)}</p>
            )}
            {payload.map((entry, index) => {
                const color = entry.payload?.color || entry.payload?.fill || entry.color || entry.fill || entry.stroke;
                const name = entry.name || entry.payload?.name || entry.dataKey;
                const value = entry.value;

                return (
                    <div key={`item-${index}`} style={{ marginTop: index > 0 ? '8px' : '0' }}>
                        {showColor && color && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <div style={colorBoxStyle(color)}></div>
                                <span style={{ color: 'var(--DT-text)', fontSize: '12px', fontWeight: 500 }}>
                                    {name}
                                </span>
                            </div>
                        )}
                        {!showColor && name && (
                            <p style={{ ...titleStyle, marginBottom: '4px' }}>{name}</p>
                        )}
                        <p style={itemStyle}>{valueFormatter(value, entry)}</p>
                    </div>
                );
            })}
        </div>
    );
};

export default CustomTooltip;
