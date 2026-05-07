import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="card p-8 text-center">
        <h1 className="text-4xl font-semibold">Page not found</h1>
        <p className="mt-3 text-sm text-slate-500">
          The page you are looking for does not exist.
        </p>
        <Link
          className="mt-5 inline-flex rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white"
          to="/login"
        >
          Go back
        </Link>
      </div>
    </div>
  );
}
