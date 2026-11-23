import { Routes, Route, Navigate } from "react-router";

import { AppProvider } from "./app/Provider";
import { UserForm } from "./features/UserForm/UserForm";
import { ChoosePhotoPage } from "./pages/ChoosePhotoPage";
import { ResultPage } from "./pages/ResultPage";

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/" element={<UserForm />} />
        <Route path="/choose" element={<ChoosePhotoPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
