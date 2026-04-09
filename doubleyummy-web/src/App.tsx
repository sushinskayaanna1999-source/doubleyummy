import { Navigate, Route, Routes } from "react-router-dom";
import { Home } from "./routes/Home";
import { Login } from "./routes/auth/Login";
import { Register } from "./routes/auth/Register";
import { Filters } from "./routes/swipe/Filters";
import { Session } from "./routes/swipe/Session";
import { Result } from "./routes/swipe/Result";
import { Library } from "./routes/library/Library";
import { AddDish } from "./routes/library/AddDish";
import { EditDish } from "./routes/library/EditDish";
import { DishDetail } from "./routes/library/DishDetail";
import { Collections } from "./routes/collections/Collections";
import { PartnerVote } from "./routes/collections/PartnerVote";
import { MatchResultPage } from "./routes/collections/MatchResult";
import { Profile } from "./routes/profile/Profile";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const App = () => (
  <Routes>
    <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
    <Route path="/auth/login" element={<Login />} />
    <Route path="/auth/register" element={<Register />} />
    <Route path="/swipe/filters" element={<ProtectedRoute><Filters /></ProtectedRoute>} />
    <Route path="/swipe/session/:id" element={<ProtectedRoute><Session /></ProtectedRoute>} />
    <Route path="/swipe/result/:id" element={<ProtectedRoute><Result /></ProtectedRoute>} />
    <Route path="/library" element={<ProtectedRoute><Library /></ProtectedRoute>} />
    <Route path="/library/add" element={<ProtectedRoute><AddDish /></ProtectedRoute>} />
    <Route path="/library/edit/:id" element={<ProtectedRoute><EditDish /></ProtectedRoute>} />
    <Route path="/library/dish/:id" element={<ProtectedRoute><DishDetail /></ProtectedRoute>} />
    <Route path="/collections" element={<ProtectedRoute><Collections /></ProtectedRoute>} />
    <Route path="/collections/shared/:code" element={<ProtectedRoute><PartnerVote /></ProtectedRoute>} />
    <Route path="/collections/match/:id" element={<ProtectedRoute><MatchResultPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);
