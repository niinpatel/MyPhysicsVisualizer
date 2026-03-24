interface ParameterSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}

export function ParameterSlider({ label, value, min, max, step, onChange }: ParameterSliderProps) {
  return (
    <div className="param-slider">
      <div className="param-slider-header">
        <span className="param-slider-label">{label}</span>
        <input
          type="number"
          className="param-slider-input"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      </div>
      <input
        type="range"
        className="param-slider-range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}
