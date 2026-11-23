import { Routes, Route, Navigate } from "react-router";

import { AppProvider } from "./app/Provider";
import { UserForm } from "./features/UserForm/UserForm";
import { ChoosePhotoPage } from "./pages/ChoosePhotoPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
  return (
    <AppProvider>
      <main className="max-w-7xl mx-auto my-8 p-8">
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
