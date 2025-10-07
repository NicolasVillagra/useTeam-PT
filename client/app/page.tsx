"use client";
import Button from "@/src/components/atoms/Button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push("/board");
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <h1 className="text-2xl font-bold">Bienvenido al tablero de tareas</h1>
      <Button onClick={handleClick}>Ingresar al tablero</Button>
    </div>
  );
}
