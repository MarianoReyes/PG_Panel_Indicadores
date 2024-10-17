// Función para obtener el color basado en el valor de TCH
const getColorFromTCH = (value, minTCH, maxTCH) => {
  if (minTCH === maxTCH) return '#ffe5b4'; // Naranja claro por defecto
  if (isNaN(value)) return 'rgb(200, 200, 200)'; // Gris para valores no numéricos

  const ratio = (value - minTCH) / (maxTCH - minTCH);
  const colorDark = { r: 255, g: 229, b: 180 };   // #cc5500 (naranja amarronado)
  const colorLight = { r: 204, g: 85, b: 0 };     // #ffe5b4 (naranja claro)

  const red = Math.floor(colorLight.r * (1 - ratio) + colorDark.r * ratio);
  const green = Math.floor(colorLight.g * (1 - ratio) + colorDark.g * ratio);
  const blue = Math.floor(colorLight.b * (1 - ratio) + colorDark.b * ratio);

  return `rgb(${red}, ${green}, ${blue})`;
};

// Componente de la Barra de Escala de Color
const ColorScaleBar = ({ minTCH, maxTCH, steps = 20 }) => {
  const minTCHn = Number(minTCH);
  const maxTCHn = Number(maxTCH);
  const minTCHf = minTCHn.toFixed(3);
  const maxTCHf = maxTCHn.toFixed(3);
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ marginRight: '10px', fontSize: '14px' }}>Min_TCH ({minTCHf})</div>
      <div style={{ display: 'flex', height: '20px', width: '100%' }}>
        {Array.from({ length: steps + 1 }).map((_, i) => {
          const value = minTCH + ((maxTCH - minTCH) * i) / steps;
          const color = getColorFromTCH(value, minTCH, maxTCH);

          return (
            <div
              key={i}
              style={{
                flex: 1,
                backgroundColor: color,
                height: '100%'
              }}
            />
          );
        })}
      </div>
      <div style={{ marginLeft: '10px', fontSize: '14px' }}>Max_TCH ({maxTCHf})</div>
    </div>
  );
};

export default ColorScaleBar;
