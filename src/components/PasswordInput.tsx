import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional ref forwarding for react-hook-form register */
  inputRef?: React.Ref<HTMLInputElement>;
}

/**
 * Reusable password input with visibility toggle.
 * Renders an input field with an eye icon button that toggles
 * between showing and hiding the password.
 *
 * Usage with react-hook-form:
 * ```tsx
 * const { register } = useForm();
 * const { ref, ...rest } = register("password", { required: true });
 * <PasswordInput inputRef={ref} {...rest} />
 * ```
 *
 * Usage standalone:
 * ```tsx
 * <PasswordInput value={password} onChange={handleChange} />
 * ```
 */
const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ inputRef, className, style, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div style={{ position: "relative", width: "100%" }}>
        <input
          {...props}
          type={visible ? "text" : "password"}
          ref={inputRef || ref}
          className={className}
          style={style}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FontAwesomeIcon
            icon={visible ? faEyeSlash : faEye}
            style={{ color: "#6c757d", fontSize: "16px" }}
          />
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
