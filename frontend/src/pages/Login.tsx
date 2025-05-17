
import Navbar from "@/components/layout/Navbar";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-isra-green">Système de Traçabilité des Semences</h1>
            <p className="mt-2 text-gray-600">ISRA Saint-Louis</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
