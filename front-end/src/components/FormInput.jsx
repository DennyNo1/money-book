const FormInput = ({
    name,
    type,
    placeholder,
    value,
    onChange,
    onBlur,
    error
}) => (
    <div className="form-item">
        <input
            type={type}
            placeholder={placeholder}
            name={name}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
        />
        <span className={`error-message ${error ? "show" : ""}`}>
            {error || " "}
        </span>
    </div>
);
export default FormInput;