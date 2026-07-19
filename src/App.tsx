import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Home = lazy(() => import("@/pages/Home"));
const Projetos = lazy(() => import("@/pages/Projetos"));
const Projeto = lazy(() => import("@/pages/Projeto"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Pagina = lazy(() => import("@/pages/Pagina"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Fallback() {
  return <div className="min-h-[60vh]" />;
}

function Main() {
  const { pathname } = useLocation();
  return (
    <main key={pathname} className="page-in flex-1">
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projetos" element={<Projetos />} />
          <Route path="/projetos/:slug" element={<Projeto />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/quem-somos" element={<Pagina slug="quem-somos" />} />
          <Route path="/faq" element={<Pagina slug="faq" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollReset />
      <Header />
      <Main />
      <Footer />
      <Analytics />
    </BrowserRouter>
  );
}
