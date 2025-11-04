import React from 'react';

interface DPEChartProps {
  type: 'DPE' | 'GES';
  classification: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
  value: number;
}

/**
 * Composant pour afficher un graphique de Diagnostic de Performance Énergétique (DPE) ou
 * de Gaz à Effet de Serre (GES).
 */
const DPEChart: React.FC<DPEChartProps> = ({ type, classification, value }) => {
  const isDPE = type === 'DPE';
  const unit = isDPE ? 'kWh/m²/an' : 'kgCO2/m²/an';
  const label = isDPE ? 'Consommation énergétique' : 'Émissions de gaz à effet de serre';

  const dpeGrades = [
    { class: 'A', color: 'bg-green-700' },
    { class: 'B', color: 'bg-green-500' },
    { class: 'C', color: 'bg-lime-400' },
    { class: 'D', color: 'bg-yellow-300' },
    { class: 'E', color: 'bg-orange-400' },
    { class: 'F', color: 'bg-red-500' },
    { class: 'G', color: 'bg-red-700' },
  ];

  const gesGrades = [
    { class: 'A', color: 'bg-purple-200' },
    { class: 'B', color: 'bg-purple-300' },
    { class: 'C', color: 'bg-purple-400' },
    { class: 'D', color: 'bg-purple-500' },
    { class: 'E', color: 'bg-purple-600' },
    { class: 'F', color: 'bg-purple-700' },
    { class: 'G', color: 'bg-purple-800' },
  ];

  const grades = isDPE ? dpeGrades : gesGrades;

  const classificationIndex = grades.findIndex(g => g.class === classification);

  return (
    <div className="font-sans text-sm max-w-sm w-full">
      <p className="font-bold text-brand-gray-700">{label}</p>
      <div className="flex items-center mt-2">
        <div className="w-10 text-xl font-bold mr-2 text-center" style={{ color: grades[classificationIndex]?.color.replace('bg-', '') }}>{classification}</div>
        <div className="flex-grow">
          <div className="flex rounded-sm overflow-hidden h-5 w-full">
            {grades.map((grade) => (
              <div key={grade.class} className={`w-[14.28%] ${grade.color}`}></div>
            ))}
          </div>
          <div className="relative h-2 w-full">
            <div className="absolute top-[-0.9rem] transform -translate-x-1/2" style={{ left: `${(classificationIndex + 0.5) * 14.28}%` }}>
              <div className="w-5 h-5 bg-black text-white text-xs flex items-center justify-center font-bold">{classification}</div>
              <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-black mx-auto" style={{ marginLeft: '6px' }}></div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-right text-brand-gray-500 mt-1">
        Logement avec une consommation de <strong className="text-brand-gray-800">{value} {unit}</strong>
      </p>
    </div>
  );
};

export default DPEChart;