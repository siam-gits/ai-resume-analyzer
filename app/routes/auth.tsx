import { usePuterStore } from "~/lib/puter";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth, puterReady, kv, clearError } = usePuterStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Safely get ?next= param
  const next = new URLSearchParams(location.search).get("next") || "/";

  // Redirect after successful login and Puter is ready
  useEffect(() => {
    if (puterReady && auth.isAuthenticated) {
      navigate(next, { replace: true });
    }
  }, [auth.isAuthenticated, puterReady, next, navigate]);

  // Trigger sign-in and refresh store immediately
  const handleSignIn = async () => {
    try {
      await auth.signIn();      // Opens Puter login popup
      await auth.refreshUser(); // Update store immediately
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // Full logout handler
  const handleLogout = async () => {
    try {
      await auth.signOut();  // Log out from Puter
      clearError();          // Clear any previous errors

      // Optionally clear KV storage to reset user-specific data
      // You can remove this if you want to keep KV
      // const keys = await kv.list("*");
      // for (const key of keys) {
      //   await kv.delete(key as string);
      // }

      // Refresh the store to ensure user is null
      await auth.refreshUser();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
useEffect(() => {
  document.body.classList.remove("dark");
}, []);

  return (
<main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>

          <div>
            {isLoading ? (
              <button className="auth-button animate-pulse">
                <p>Signing you in...</p>
              </button>
            ) : auth.isAuthenticated ? (
              <button className="auth-button" onClick={handleLogout}>
                <p>Log Out</p>
              </button>
            ) : (
              <button className="auth-button" onClick={handleSignIn}>
                <p>Log In</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
