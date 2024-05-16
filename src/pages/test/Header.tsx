import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
	const { pathname } = useLocation();
	const nav = useNavigate();

	function handleLogOut() {
		(async () => {
			console.log("REQUEST OK");

			await fetch(`http://localhost:3000/api/logout`, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				credentials: "include",
			}).then(() => {
				nav("/login");
			});
		})();
	}

	if (!(pathname === "/login" || pathname === "/register")) {
		return (
			<header className="flex items-center justify-between px-4 py-3 bg-white shadow-md ">
				<div className="flex items-center gap-4">
					<a className="text-2xl font-semibold" href="/">
						Home
					</a>
				</div>

				<div className="flex items-center gap-4">
					<div onClick={handleLogOut} className="text-xl font-medium">
						Log Out
					</div>
				</div>
			</header>
		);
	}
}
