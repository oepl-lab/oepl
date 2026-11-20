"use client";

/** 비밀번호 입력칸 + 보기/숨기기 토글 (스타일: src/styles/password-input.css) */

import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLang } from "@/contexts/LangContext";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export default function PasswordInput({ className, ...props }: PasswordInputProps) {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);
  const label = visible ? t.login.hidePassword : t.login.showPassword;

  return (
    <div className="password-input">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={["password-input-field", className].filter(Boolean).join(" ")}
      />
      <button
        type="button"
        className="password-input-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={label}
        aria-pressed={visible}
        title={label}
      >
        {visible ? <EyeOff size={18} aria-hidden /> : <Eye size={18} aria-hidden />}
      </button>
    </div>
  );
}
