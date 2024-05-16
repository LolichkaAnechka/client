import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface RegError {
	username?: {
		msg: string;
	};
	server?: {
		msg: string;
	};
	password?: {
		msg: string;
	};
}

function validatePassword(password: string) {
	const minLength = 8; // Minimum length for password
	const maxLength = 30; // Maximum length for password
	const hasLowercase = /[a-z]/; // Regular expression to check for lowercase letters

	// Check if password length is within the allowed range
	if (password.length < minLength || password.length > maxLength) {
		return {
			valid: false,
			message: `Password must be between ${minLength} and ${maxLength} characters.`,
		};
	}

	// Check if password contains at least one lowercase letter
	if (!hasLowercase.test(password)) {
		return {
			valid: false,
			message: "Password must contain at least one lowercase letter.",
		};
	}

	// Password is valid
	return { valid: true, message: "Password is valid." };
}

// Function to validate username
function validateUsername(username: string) {
	const minLength = 3; // Minimum length for username
	const maxLength = 20; // Maximum length for username
	const validChars = /^[a-zA-Z0-9_]+$/; // Regular expression to allow only alphanumeric characters and underscores
	const hasLowercase = /[a-z]/;

	// Check if username length is within the allowed range
	if (username.length < minLength || username.length > maxLength) {
		return {
			valid: false,
			message: `Username must be between ${minLength} and ${maxLength} characters.`,
		};
	}

	// Check if username contains only valid characters
	if (!validChars.test(username)) {
		return {
			valid: false,
			message: "Username can only contain letters, numbers, and underscores.",
		};
	}

	if (!hasLowercase.test(username)) {
		return {
			valid: false,
			message: "Username must contain at least one lowercase letter.",
		};
	}

	// Username is valid
	return { valid: true, message: "Username is valid." };
}

function Register() {
	useEffect(() => {}, []);
	const [username, setUsername] = useState("");
	const [responce, setResponce] = useState("");
	const [error, setError] = useState<RegError>();
	const [password, setPassword] = useState("");
	const [passwordRepeat, setPasswordRepeat] = useState("");

	const nav = useNavigate();

	const BASE_URL = "http://localhost:3000/api/";

	function handleRegRequest() {
		(async () => {
			const validation = validateUsername(username);

			if (!validation.valid) {
				setError({ ...error, username: { msg: validation.message } });
				return;
			}

			console.log("REGA TRIGGERED");

			if (password !== passwordRepeat) {
				setError({ ...error, password: { msg: "Passwords do not match" } });
				return;
			}

			const passwordValidation = validatePassword(password);

			if (!passwordValidation.valid) {
				setError({ ...error, password: { msg: passwordValidation.message } });
				return;
			}

			await fetch(BASE_URL + "register/", {
				credentials: "same-origin",
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			}).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();

					setResponce(resJson.message);
					await new Promise((resolve) => setTimeout(resolve, 3000));
					nav("/login");
				} else {
					const resJson = await res.json();
					setError({ ...error, server: { msg: resJson.error } });
					return;
				}
			});
		})();
	}

	return (
		<div className="flex h-screen w-full items-center justify-center font-inter bg-gray-100 px-4">
			<div className="w-full max-w-md space-y-6">
				<div className="text-center">
					<h1 className="text-3xl font-bold">Welcome</h1>
					<p className="text-gray-500 text-lg dark:text-gray-400">
						Please fill up the form to Sign Up.
					</p>
				</div>
				<div className="card rounded-lg space-y-8 text-lg font-extralight border bg-white border-gray-300 p-8">
					<div className="card-content space-y-4 ">
						<div className="space-y-2 flex flex-col ">
							<label>Username</label>
							<input
								value={username}
								onChange={(e) => {
									setError({ ...error, username: undefined });
									setUsername(e.target.value);
								}}
								className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
								id="email"
								placeholder="AbobaAbobenko"
								required
								type="text"
							/>
							<div className="w-full text-center text-red-600">
								{error?.username?.msg}
							</div>
						</div>
						<div className="space-y-2">
							<label htmlFor="password">Password</label>
							<input
								value={password}
								onChange={(e) => {
									setError({ ...error, password: undefined });
									setPassword(e.target.value);
								}}
								className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
								id="password"
								required
								type="password"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="password">Repeat Password</label>
							<input
								value={passwordRepeat}
								onChange={(e) => {
									setError({ ...error, password: undefined });
									setPasswordRepeat(e.target.value);
								}}
								className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
								id="password"
								required
								type="password"
							/>
							<div className="w-full text-center text-red-600">
								{error?.password?.msg}
							</div>
						</div>
					</div>
					<div className="py-2 card-footer w-full bg-black rounded-lg text-white">
						<button type="button" onClick={handleRegRequest} className="w-full">
							Sign up
						</button>
					</div>
				</div>
				<div className="text-center text-sm text-gray-500 dark:text-gray-400">
					Already have an account?
					<a className="font-medium underline underline-offset-4" href="/login">
						Sign In
					</a>
				</div>
			</div>
			{error?.server && (
				<ServerError
					error={error.server.msg}
					closeError={() => {
						setError({ ...error, server: undefined });
					}}
				/>
			)}
			{error?.server && (
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

export function ServerError({
	error,
	closeError,
}: {
	error: string;
	closeError: () => void;
}) {
	return (
		<div className="fixed bottom-4 text-base left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-md bg-red-500 px-4 py-3 text-white shadow-lg">
			<div className="flex items-center justify-between">
				<p>{error}</p>
				<button
					onClick={() => {
						closeError();
					}}
					aria-label="Close"
					className="rounded-md bg-red-600 px-2 py-1 text-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export function ServerResponce({
	responce,
	closeResponce,
}: {
	responce: string;
	closeResponce: () => void;
}) {
	useEffect(() => {
		setTimeout(() => closeResponce(), 3000);
	}, []);
	return (
		<div className="fixed bottom-4 text-base left-1/2 z-50 w-full max-w-md -translate-x-1/2 rounded-md bg-green-500 px-4 py-3 text-white shadow-lg">
			<div className="flex items-center justify-between">
				<p>{responce}</p>
				<button
					onClick={() => {
						closeResponce();
					}}
					aria-label="Close"
					className="rounded-md bg-green-600 px-2 py-1 text-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			</div>
		</div>
	);
}

export default Register;
