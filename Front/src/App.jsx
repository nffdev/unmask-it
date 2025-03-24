import { BrowserRouter, Routes, Route } from "react-router-dom";
import useRouter from "@/lib/hooks/useRouter";

export default function App() {
  const routes = useRouter();

  return (
    <BrowserRouter>
      <Routes>
        {routes.map(({ path, component: Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
        <Route path="*" element={<h1>404: Not found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}