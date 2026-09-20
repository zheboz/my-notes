import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from "../lib/axios";
import { useAuth } from "../context/useAuth";

const AuthPage = ({ mode }) => {
  const isLogin = mode === "login";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email || password.length < 8) {
      toast.error("请输入邮箱和至少 8 位密码");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await api.post(endpoint, { email, password });
      signIn(response.data);
      const destination = location.state?.from?.pathname || "/";
      navigate(destination, { replace: true });
      toast.success(isLogin ? "登录成功" : "注册成功");
    } catch (error) {
      toast.error(error.response?.data?.message || "认证失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-base-200 grid place-items-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl justify-center text-primary">
            My Notes
          </h1>
          <p className="text-center text-base-content/60">
            {isLogin ? "登录后管理你的笔记" : "创建账号开始记录"}
          </p>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <label className="form-control">
              <span className="label-text mb-2">邮箱</span>
              <input
                type="email"
                className="input input-bordered"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-2">密码</span>
              <input
                type="password"
                className="input input-bordered"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={isLogin ? "current-password" : "new-password"}
                minLength={8}
                required
              />
            </label>
            <button className="btn btn-primary w-full" disabled={loading}>
              {loading ? "处理中..." : isLogin ? "登录" : "注册"}
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            {isLogin ? "还没有账号？" : "已有账号？"}{" "}
            <Link className="link link-primary" to={isLogin ? "/register" : "/login"}>
              {isLogin ? "立即注册" : "去登录"}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default AuthPage;
