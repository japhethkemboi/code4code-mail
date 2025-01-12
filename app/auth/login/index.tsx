import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../AuthProvider";
import { Link, To, useNavigate, useParams } from "react-router-dom";
import { Button, InputComponent } from "c4cui";

const Login = () => {
  const { redirectPath } = useParams();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await login(credentials);
    if (res.ok) {
      toast.success("Logged in successfully! Welcome back.");
      navigate((redirectPath as To) || "/", { replace: true });
    } else {
      toast.error(res.error || "Invalid username or password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col w-full gap-8 pt-24 p-4 items-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <form className="w-full max-w-2xl flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-4xl">Login</h1>
        <InputComponent
          name="username"
          type="email"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e })}
          placeholder="Email Address"
        />
        <InputComponent
          name="password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e })}
          placeholder="Password"
        />
        <Button type="submit" label="Login" disabled={loading} className="p-4" />
      </form>
      <Link to="/signup" className="text-blue-500 hover:underline">
        Don&apos;t have an account? Signup.
      </Link>
    </div>
  );
};

export default Login;
