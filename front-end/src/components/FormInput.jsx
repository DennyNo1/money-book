const FormInput = ({ name, type, placeholder, value, onChange, onBlur, error }) => (
    <div>
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
        <span className="error-message" data-field={name}>{error}</span>
    </div>
);
export default FormInput;