import { useState, useEffect } from "react";
import { useAuth } from "../features/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, changePassword, uploadProfileIcon, API_BASE_URL } from "../services/apiClient";

export default function MyPageScreen() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setDisplayName(profile.displayName);
        setEmail(profile.email);
        setBio(profile.bio || "");
        setIconUrl(profile.iconUrl || "");
        setIconPreview(profile.iconUrl || null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        }
      }
    };

    loadProfile();
  }, [isAuthenticated, navigate]);

  const handleIconFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("ファイルサイズは10MB以下にしてください");
        e.target.value = '';
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError("画像ファイルのみアップロード可能です");
        e.target.value = '';
        return;
      }
      setError("");
      setIconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // Upload icon file if selected
      let finalIconUrl = iconUrl;
      if (iconFile) {
        const uploadResult = await uploadProfileIcon(iconFile);
        finalIconUrl = uploadResult.iconUrl;
      }

      await updateProfile(displayName, email, bio, finalIconUrl);
      setSuccess("プロフィールが更新されました");
      setIsEditing(false);
      setIconFile(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword.length < 8) {
      setError("新しいパスワードは8文字以上である必要があります");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setError("新しいパスワードが一致しません");
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(currentPassword, newPassword, newPasswordConfirm);
      setSuccess("パスワードが変更されました");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setIsChangingPassword(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="page">ログインしてください</div>;
  }

  return (
    <main className="page">
      <div className="auth-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
        <h1 className="auth-title">マイページ</h1>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        {/* プロフィール表示/編集 */}
        <div className="quiet-card" style={{ marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>プロフィール情報</h2>

          {!isEditing ? (
            <>
              <p><strong>ユーザーID:</strong> {user?.userId}</p>
              <p><strong>表示名:</strong> {displayName}</p>
              <p><strong>メールアドレス:</strong> {email}</p>
              <p><strong>自己紹介:</strong> {bio || "未設定"}</p>
              <p><strong>アイコン:</strong></p>
              {iconUrl && (
                <img
                  src={`${API_BASE_URL}${iconUrl}`}
                  alt="icon"
                  style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "8px", marginTop: "5px" }}
                />
              )}
              {!iconUrl && <p style={{ color: "#888" }}>未設定</p>}
              <button
                className="auth-button"
                onClick={() => setIsEditing(true)}
                style={{ marginRight: "10px" }}
              >
                編集
              </button>
            </>
          ) : (
            <form onSubmit={handleUpdateProfile}>
              <div className="form-group">
                <label htmlFor="displayName">表示名</label>
                <input
                  id="displayName"
                  type="text"
                  className="form-input"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">メールアドレス</label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">自己紹介</label>
                <textarea
                  id="bio"
                  className="form-input"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  disabled={isLoading}
                  style={{ fontFamily: "inherit" }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="iconFile">アイコン画像</label>
                <input
                  id="iconFile"
                  type="file"
                  accept="image/*"
                  className="form-input"
                  onChange={handleIconFileChange}
                  disabled={isLoading}
                />
                {iconPreview && (
                  <div style={{ marginTop: "10px" }}>
                    <img
                      src={iconPreview}
                      alt="プレビュー"
                      style={{ maxWidth: "100px", maxHeight: "100px", borderRadius: "8px" }}
                    />
                  </div>
                )}
                <small className="form-hint">画像ファイルのみ（10MB以下）</small>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="auth-button"
                  disabled={isLoading}
                >
                  {isLoading ? "更新中..." : "更新"}
                </button>
                <button
                  type="button"
                  className="auth-button secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>

        {/* パスワード変更 */}
        <div className="quiet-card" style={{ marginBottom: "20px" }}>
          <h2 style={{ marginTop: 0 }}>パスワード変更</h2>

          {!isChangingPassword ? (
            <button
              className="auth-button"
              onClick={() => setIsChangingPassword(true)}
            >
              パスワードを変更
            </button>
          ) : (
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label htmlFor="currentPassword">現在のパスワード</label>
                <input
                  id="currentPassword"
                  type="password"
                  className="form-input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">新しいパスワード</label>
                <input
                  id="newPassword"
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <small className="form-hint">8文字以上</small>
              </div>

              <div className="form-group">
                <label htmlFor="newPasswordConfirm">新しいパスワード（確認）</label>
                <input
                  id="newPasswordConfirm"
                  type="password"
                  className="form-input"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button
                  type="submit"
                  className="auth-button"
                  disabled={isLoading}
                >
                  {isLoading ? "変更中..." : "変更"}
                </button>
                <button
                  type="button"
                  className="auth-button secondary"
                  onClick={() => setIsChangingPassword(false)}
                  disabled={isLoading}
                >
                  キャンセル
                </button>
              </div>
            </form>
          )}
        </div>

        <button
          className="auth-button secondary"
          onClick={() => navigate("/")}
          style={{ width: "100%" }}
        >
          戻る
        </button>
      </div>
    </main>
  );
}
