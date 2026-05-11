import { useEffect, useState } from "react";
import { CircleMenu } from "../components/CircleMenu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

import {
  checkSkyToday,
  getSkyCheckStatus
} from "../services/apiClient";

export function HomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setIsLoading(true);

      await Promise.allSettled([
        getSkyCheckStatus()
      ]);

      if (!mounted) return;
      setIsLoading(false);
    };

    void load();

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ★ 円形メニュー
  const menuItems = [
    { id: "history", label: "今日の宇宙史", onSelect: () => navigate("/history") },
    { id: "image", label: "今日の宇宙画像", onSelect: () => navigate("/image") },
    { id: "tonight", label: "今夜見える星", onSelect: () => navigate("/tonight") },
    { id: "solar", label: "太陽系図鑑", onSelect: () => navigate("/solar") },
    { id: "share", label: "星結び", onSelect: () => navigate("/share") },
    { id: "mypage", label: "マイページ", onSelect: () => navigate("/mypage") }
  ];

  return (
    <main className="page">
      <div className="home-header">
        <h1 className="title">Starline</h1>
        {isAuthenticated && user && (
          <div className="home-auth-info">
            <span className="user-name">{user.displayName}</span>
            <button className="home-logout-button" onClick={handleLogout}>ログアウト</button>
          </div>
        )}
      </div>

      {!isAuthenticated ? (
        <div className="home-auth-prompt">
          <p className="card-body">機能を使うにはログインしてください</p>
          <button className="auth-button" onClick={() => navigate("/login")}>ログイン</button>
          <button className="auth-button secondary" onClick={() => navigate("/signup")}>新規登録</button>
        </div>
      ) : (
        <>
          <p className="subtitle">今日の宇宙と、今夜見上げる空</p>

          {isLoading ? (
            <p className="card-body">読み込み中...</p>
          ) : (
            <CircleMenu items={menuItems} />
          )}
        </>
      )}

    </main>
  );
}