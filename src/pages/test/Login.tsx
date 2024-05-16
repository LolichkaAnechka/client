import { useState } from "react";
import { ServerError, ServerResponce } from "./Rega";
import { useNavigate } from "react-router-dom";

function Login() {
	const [username, setUsername] = useState("");
	const [responce, setResponce] = useState("");

	const [password, setPassword] = useState("");
	const [error, setError] = useState<string>();
	const nav = useNavigate();

	function handleLoginRequest() {
		(async () => {
			await fetch("http://localhost:3000/api/login", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					username,
					password,
				}),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();

					setResponce(resJson.message);
					await new Promise((resolve) => setTimeout(resolve, 3000));
					nav("/");
				} else {
					console.log("Responce not ok");
					const resJson = await res.json();
					setError(resJson.error);
					return;
				}
			});
		})();
	}

	return (
		<div className="flex h-screen w-full items-center justify-center font-inter bg-gray-100 px-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Welcome back</h1>
					<p className="text-gray-500 text-lg dark:text-gray-400">
						Enter your username and password to sign in.
					</p>
				</div>
				<div className="card rounded-lg space-y-8 text-lg font-light border bg-white border-gray-300 p-8">
					<div className="card-content space-y-4 ">
						<div className="space-y-2 flex flex-col ">
							<label>Username</label>
							<input
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
								id="email"
								placeholder="AbobaAbobenko"
								required
								type="text"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="password">Password</label>
							<input
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
								id="password"
								required
								type="password"
							/>
						</div>
					</div>
					<div className="py-2 card-footer w-full bg-black rounded-lg text-white">
						<button onClick={handleLoginRequest} className="w-full">
							Sign in
						</button>
					</div>
				</div>
				<div className="text-center text-sm text-gray-500 dark:text-gray-400">
					Don't have an account?
					<a
						className="font-medium underline underline-offset-4"
						href="/register"
					>
						Register
					</a>
				</div>
			</div>
			{error && (
				<ServerError
					error={error}
					closeError={() => {
						setError("");
					}}
				/>
			)}
			{responce && (
				<ServerResponce
					responce={responce}
					closeResponce={() => {
						setResponce("");
					}}
				/>
			)}
		</div>
	);
}
export default Login;
