import { useEffect, useRef } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router";

import { AppProvider } from "./app/Provider";
import { UserForm } from "./features/UserForm/UserForm";
import { ChoosePhotoPage } from "./pages/ChoosePhotoPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const heading = mainRef.current?.querySelector("h1");
    heading?.focus();
  }, [pathname]);

  return (
    <AppProvider>
      <main ref={mainRef} className="max-w-xl w-full mx-auto my-8 p-8">
        <Routes>
          <Route path="/" element={<UserForm />} />
          <Route path="/choose" element={<ChoosePhotoPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </AppProvider>
  );
}

export default App;
