import { toast } from "react-toastify";
import { useAuth } from "../AuthProvider";
import { useEffect, useState } from "react";
import { Link, To, useNavigate, useParams } from "react-router-dom";
import { Button, InputComponent } from "c4cui";

export const Signup = () => {
  const { redirectPath } = useParams();
  const { signup, login } = useAuth();
  const [credentials, setCredentials] = useState({ first_name: "", last_name: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signup(credentials);
    if (res.ok) {
      toast.success("Signup successful. Logging you in...");
      const loginres = await login({ username: credentials.username, password: credentials.password });
      if (loginres.ok) {
        toast.success("Logged in successfully. Welcome.");
      } else {
        toast.success("Failed to log you in, Please log in.");
        navigate("/login", { replace: true });
      }
      navigate((redirectPath as To) || "/", { replace: true });
    } else {
      toast.error(res.error || "Error while creating your account.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-24 p-4 w-full flex flex-col gap-8 items-center bg-[var(--bg-color)] text-[var(--text-color)]">
      <form className="w-full max-w-2xl flex flex-col gap-8" onSubmit={handleSubmit}>
        <h1 className="text-4xl">Sign up</h1>
        <InputComponent
          name="first_name"
          type="name"
          value={credentials.first_name}
          onChange={(e) => setCredentials({ ...credentials, first_name: e })}
          placeholder="First Name"
        />
        <InputComponent
          name="last_name"
          type="name"
          value={credentials.last_name}
          onChange={(e) => setCredentials({ ...credentials, last_name: e })}
          placeholder="Last Name"
        />
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
          minLength={8}
          value={credentials.password}
          onChange={(e) => setCredentials({ ...credentials, password: e })}
          placeholder="Password"
          generatePassword={true}
        />
        <Button type="submit" label="Sign up" className="p-4" disabled={loading} />
      </form>
      <Link to="/login" className="text-blue-500 hover:underline">
        Already have an account? Login.
      </Link>
    </div>
  );
};
