import { usePuterStore } from "~/lib/puter";
import { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { LogOut, Trash2, User } from "lucide-react";
import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";

export default function Home() {
  const { auth, kv, fs } = usePuterStore();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth.isAuthenticated) navigate("/auth?next=/");
  }, [auth.isAuthenticated, navigate]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map((r) => JSON.parse(r.value) as Resume);
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };
    loadResumes();
  }, [kv]);

  const handleWipe = async () => {
    const files = (await fs.readDir("./")) as FSItem[];
    await Promise.all(files.map((file) => fs.delete(file.path)));
    await kv.flush();
    setResumes([]);
    setToastMessage("All data wiped successfully!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 relative">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-5 py-3 rounded-xl shadow-lg animate-slide-up z-50">
          {toastMessage}
        </div>
      )}

      {/* Profile Dropdown */}
      {auth.isAuthenticated && (
        <div ref={menuRef} className="fixed top-4 right-6 z-30">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
          >
            <User className="w-6 h-6 text-gray-700" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl p-4 animate-fade-in">
              <div className="text-sm text-gray-600 mb-3">
                Signed in as <br />
<span className="username-light font-semibold text-gray-800">
  {auth.user?.username}
</span>
              </div>
              <hr className="my-2 border-gray-200" />
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
                <button
                  onClick={handleWipe}
                  className="flex items-center gap-2 text-sm bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Wipe Data
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Resume Section */}
      <section className="main-section px-4 md:px-16 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Track Your Applications & <br />Resume Ratings

          </h1>
          <p className="mt-4 text-gray-600 text-lg md:text-xl">
            {loadingResumes
              ? "Loading your resumes..."
              : resumes.length === 0
              ? "No resumes found. Upload your first resume to get feedback."
              : "Review your submissions and check AI-powered feedback."}
          </p>
        </div>

        {loadingResumes && (
          <div className="flex justify-center">
            <img src="/images/resume-scan-2.gif" className="w-52" />
          </div>
        )}

{!loadingResumes && resumes.length > 0 && (
  <div
    className="grid gap-8 px-4 md:px-8 lg:px-16 mx-auto"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      maxWidth: "1400px",
    }}
  >
    {resumes.map((resume) => (
      <ResumeCard key={resume.id} resume={resume} />
    ))}
  </div>
)}



        {!loadingResumes && resumes.length === 0 && (
          <div className="flex justify-center mt-10">
            <Link
              to="/upload"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-2xl font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
            >
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
