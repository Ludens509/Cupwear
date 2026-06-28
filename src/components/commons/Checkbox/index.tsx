interface CheckboxProps {
  label: string;
  handleOnChange: (label: string) => void;
  className?: string;
}

const Checkbox = ({ label, handleOnChange, className }: CheckboxProps) => (
  <div className={className}>
    <label>
      <input type="checkbox" onChange={() => handleOnChange(label)} />
      <span className="checkmark">{label}</span>
    </label>
  </div>
);

export default Checkbox;
