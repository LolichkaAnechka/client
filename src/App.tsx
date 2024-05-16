import { BrowserRouter, Routes, Route } from "react-router-dom";

import Author from "./pages/test/Author";
import Login from "./pages/test/Login";
import Register from "./pages/test/Rega";
import { Header } from "./pages/test/Header";
import { DepartamentList } from "./pages/test/DepartamentList";
import { Departament } from "./pages/test/Departament";

export default function App() {
	return (
		<BrowserRouter>
			<Header></Header>
			<Routes>
				<Route path="/author/:authorID" element={<Author />} />
				<Route path="/departament/:departamentId" element={<Departament />} />
				<Route path="*" element={<DepartamentList />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/" element={<DepartamentList />} />
			</Routes>
		</BrowserRouter>
	);
}
