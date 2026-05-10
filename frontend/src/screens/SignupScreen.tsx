import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

export default function SignupScreen() {
  const [userId, setUserId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();

  const validateUserId = (id: string): string | null => {
    if (!id) return "ユーザーIDは必須です";
    if (id.length < 3 || id.length > 20) return "ユーザーIDは3～20文字である必要があります";
    if (!/^[a-z0-9_]+$/.test(id)) return "ユーザーIDは英小文字、数字、アンダースコアのみ使用可能です";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const userIdError = validateUserId(userId);
    if (userIdError) {
      setError(userIdError);
      return;
    }

    if (!displayName.trim()) {
      setError("表示名は必須です");
      return;
    }

    if (!email) {
      setError("メールアドレスは必須です");
      return;
    }

    if (password.length < 8) {
      setError("パスワードは8文字以上である必要があります");
      return;
    }

    if (password !== passwordConfirm) {
      setError("パスワードが一致しません");
      return;
    }

    setIsSubmitting(true);

    try {
      await signup(userId, displayName, email, password, passwordConfirm);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("登録に失敗しました");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <h1 className="auth-title">新規登録</h1>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="userId">ユーザーID</label>
            <input
              id="userId"
              type="text"
              className="form-input"
              placeholder="starline_tarou"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              required
              disabled={isLoading || isSubmitting}
            />
            <small className="form-hint">英小文字、数字、アンダースコア（3～20文字）</small>
          </div>

          <div className="form-group">
            <label htmlFor="displayName">表示名</label>
            <input
              id="displayName"
              type="text"
              className="form-input"
              placeholder="星結　太郎"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">メールアドレス</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading || isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <div className="password-input-group">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading || isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading || isSubmitting}
              >
                {showPassword ? "非表示" : "表示"}
              </button>
            </div>
            <small className="form-hint">8文字以上</small>
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirm">パスワード確認</label>
            <div className="password-input-group">
              <input
                id="passwordConfirm"
                type={showPasswordConfirm ? "text" : "password"}
                className="form-input"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                disabled={isLoading || isSubmitting}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                disabled={isLoading || isSubmitting}
              >
                {showPasswordConfirm ? "非表示" : "表示"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || isSubmitting || !userId || !displayName || !email || !password || !passwordConfirm}
          >
            {isSubmitting ? "登録中..." : "アカウント作成"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            既にアカウントをお持ちですか？
            <Link to="/login" className="auth-link">
              ログイン
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
