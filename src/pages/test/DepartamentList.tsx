import { useEffect, useState } from "react";
import { ServerError } from "./Rega";
import { useNavigate } from "react-router-dom";

interface Departament {
	id: number;
	name: string;
	description: string;
}

export function DepartamentList() {
	const [isCreationOpen, setCreationOpen] = useState(false);
	const [departaments, setDepartaments] = useState<Departament[]>([]);

	const nav = useNavigate();
	useEffect(() => {
		(async () => {
			await fetch(
				"http://localhost:3000/api/departament/getDepartamentDataFromUser",
				{
					method: "GET",
					credentials: "include",
				}
			).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();

					setDepartaments(resJson);
				}

				const resp = await res.json();
				if (resp.redirect) {
					nav(resp.redirect);
				}
				return;
			});
		})();
	}, []);

	function handleDeleteDepartament(id: number) {
		(async () => {
			await fetch("http://localhost:3000/api/departament/delete", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					id,
				}),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					setDepartaments(departaments.filter((dep) => dep.id !== id));
				}
				const resp = await res.json();
				if (resp.redirect) {
					nav(resp.redirect);
				}
				return;
			});
		})();
	}

	return (
		<main className="w-full h-full bg-gray-100">
			{isCreationOpen && (
				<DepartamentCreation
					closeCreationPanel={() => {
						setCreationOpen(false);
					}}
					addToList={(dep) => {
						setDepartaments([...departaments, dep]);
					}}
				/>
			)}

			<div className="flex justify-end pr-10 p-6">
				<button
					onClick={() => setCreationOpen(true)}
					className="flex justify-between items-center bg-white shadow-md p-6 rounded-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
				>
					<svg
						className="h-5 w-5 mr-2"
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
						<path d="M5 12h14" />
						<path d="M12 5v14" />
					</svg>
					Create Element
				</button>
			</div>
			<section className="grid gap-6 p-6 md:p-8 lg:p-10">
				{departaments ? (
					departaments.map((departament) => {
						return (
							<div
								key={departament.id}
								className="bg-white rounded-lg shadow-md overflow-hidden  relative"
							>
								<div className="p-4 md:p-6">
									<h3 className="text-xl font-bold mb-2 no-underline">
										<a href={`/departament/${departament.id}`}>
											{departament.name}
										</a>
									</h3>
									<p className="text-gray-600 ">{departament.description}</p>
								</div>
								<div className="absolute top-4 right-4 flex gap-2">
									<button
										onClick={() => {
											handleDeleteDepartament(departament.id);
										}}
										className="p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200"
									>
										<svg
											className="h-5 w-5"
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
											<path d="M3 6h18" />
											<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
											<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
										</svg>
										<span className="sr-only">Delete</span>
									</button>
									<button className="p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200">
										<svg
											className="h-5 w-5"
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
											<path d="M5 12h14" />
											<path d="M12 5v14" />
										</svg>
										<span className="sr-only">Add</span>
									</button>
								</div>
							</div>
						);
					})
				) : (
					<></>
				)}
			</section>
		</main>
	);
}

function DepartamentCreation({
	closeCreationPanel,
	addToList,
}: {
	closeCreationPanel: () => void;
	addToList: (dep: Departament) => void;
}) {
	const [depName, setDepName] = useState("");
	const [depDescription, setDepDescription] = useState("");
	const [error, setError] = useState("");
	function handleDepartamentCreation() {
		(async () => {
			await fetch("http://localhost:3000/api/departament/create", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({
					name: depName,
					description: depDescription,
				}),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();

					addToList(resJson);
					closeCreationPanel();
				} else {
					const resJson = await res.json();
					setError(resJson.error);
				}
				return;
			});
		})();
	}
	return (
		<div className="z-10 absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-opacity-60 bg-slate-950">
			<button
				onClick={closeCreationPanel}
				className="absolute top-4 right-4 rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
			>
				<svg
					className="h-4 w-4 text-gray-500 dark:text-gray-400"
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
				<span className="sr-only">Close</span>
			</button>
			<div className="p-6 bg-white rounded-md mx-auto w-full max-w-md space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Create New Item</h1>
					<p className="text-gray-500 dark:text-gray-400">
						Fill out the form to add a new item.
					</p>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleDepartamentCreation();
					}}
					className="space-y-4 text-lg font-light"
				>
					<div className="space-y-2">
						<label htmlFor="name">Name</label>
						<input
							value={depName}
							onChange={(e) => setDepName(e.target.value)}
							id="name"
							required
							placeholder="Enter a name"
							className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="description">Description</label>
						<textarea
							value={depDescription}
							onChange={(e) => setDepDescription(e.target.value)}
							id="description"
							placeholder="Enter a description"
							className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
							required
						/>
					</div>
					<button
						className="py-2 card-footer w-full bg-black rounded-lg text-white"
						type="submit"
					>
						Create Item
					</button>
					{error && (
						<ServerError
							error={error}
							closeError={() => {
								setError("");
							}}
						/>
					)}
				</form>
			</div>
		</div>
	);
}
