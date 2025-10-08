"use client";
import Button from "@/src/components/atoms/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/board");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="avatar placeholder">
              <div className="bg-primary flex items-center justify-center text-primary-content rounded-full w-24">
                <span className="text-3xl font-bold">T</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-base-content">
              Bienvenido a
              <span className="block text-primary">useTeam</span>
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Gestiona tus proyectos y tareas de manera colaborativa con nuestro tablero Kanban intuitivo
            </p>
          </div>

          <div className="pt-8">
            <Button 
              onClick={handleClick}
              variant="primary"
              className="btn-lg btn-wide text-lg"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7l5 5m0 0l-5 5m5-5H6" 
                />
              </svg>
              Ingresar al Tablero
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-primary mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="card-title justify-center text-lg">Organización</h3>
                <p className="text-sm text-base-content/70">
                  Organiza tus tareas en columnas personalizables para un flujo de trabajo eficiente
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-primary mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="card-title justify-center text-lg">Colaboración</h3>
                <p className="text-sm text-base-content/70">
                  Trabaja en equipo con herramientas de colaboración en tiempo real
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-primary mb-4">
                  <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="card-title justify-center text-lg">Productividad</h3>
                <p className="text-sm text-base-content/70">
                  Mejora tu productividad con métricas y seguimiento de progreso
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <div>
          <p className="text-sm">
            © 2025 useTeam. Gestiona tus proyectos de manera eficiente.
          </p>
        </div>
      </footer>
    </div>
  );
}
