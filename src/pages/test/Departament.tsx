import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ServerError, ServerResponce } from "./Rega";
import { tProfile } from "../../types/Types";
import { ArticleList } from "./ArticleList";

interface DepartamentData {
	id: number;
	name: string;
	description: string;
	users: {
		userId: number;
		departamentId: number;
		user: { id: number; username: string; role: string };
	}[];
	lecturers: {
		id: number;
		name: string;
		surname: string;
		departamentId: number;
		sceintificDBData: {
			id: string;
			source: "SCHOLAR";
		}[];
	}[];
}

type Tab = "ARTICLES" | "LECTURERS" | "USERS";

export function Departament() {
	let params = useParams();
	const [departamentData, setDepartamentData] = useState<DepartamentData>();
	const [tabState, setTabState] = useState<Tab>("ARTICLES");
	const [isLecturerCreationOpen, setLecturerCreationOpen] = useState(false);
	const [isUserAdding, setUserAdding] = useState(false);
	const [error, setError] = useState("");
	const [responce, setResponce] = useState("");
	const nav = useNavigate();

	useEffect(() => {
		(async () => {
			await fetch(
				"http://localhost:3000/api/departament/getDepartamentFromId",
				{
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						id: Number(params.departamentId),
					}),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();
					if (resJson !== undefined) {
						setDepartamentData(resJson);
					}
				} else {
					const resp = await res.json();
					if (resp.redirect) {
						nav(resp.redirect);
					}
				}
				return;
			});
		})();
	}, []);

	function handleLecturerDeletion(id: number) {
		(async () => {
			await fetch("http://localhost:3000/api/lecturer/delete", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify({ id: id }),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();
					setResponce(resJson.message);

					const newLecturerArray = departamentData?.lecturers.filter(
						(lecturer) => lecturer.id !== id
					);

					if (departamentData) {
						setDepartamentData({
							...departamentData,
							lecturers: newLecturerArray ?? [],
						});
					}
				} else {
					const resJson = await res.json();
					setError(resJson.error);
				}
				return;
			});
		})();
	}

	function handleUserDeletion(username: string) {
		(async () => {
			if (!departamentData) {
				return;
			}
			const body: UserAddToDepasrtament = {
				username: username,
				departamentId: departamentData.id,
			};
			await fetch("http://localhost:3000/api/deleteFromDepartament", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify(body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();
					setResponce("User removed successfully");

					const newUsersArray = departamentData.users.filter(
						(user) => user.userId !== resJson.id
					);

					if (departamentData) {
						setDepartamentData({
							...departamentData,
							users: newUsersArray ?? [],
						});
					}
				} else {
					const resJson = await res.json();
					setError(resJson.error);
				}
				return;
			});
		})();
	}

	return (
		<>
			{isLecturerCreationOpen && departamentData && (
				<LecturerCreation
					closeCreationPanel={() => {
						setLecturerCreationOpen(false);
					}}
					depId={departamentData.id}
					updateDepartamentData={(newLecturer: {
						id: number;
						name: string;
						surname: string;
						departamentId: number;
						sceintificDBData: {
							id: string;
							source: "SCHOLAR";
						}[];
					}) => {
						const newLecturerArray = [
							...departamentData.lecturers,
							newLecturer,
						];

						if (departamentData) {
							setDepartamentData({
								...departamentData,
								lecturers: newLecturerArray ?? [],
							});
						}

						console.log(departamentData.lecturers);
					}}
				/>
			)}
			{isUserAdding && departamentData && (
				<UserAddToDepartament
					closeCreationPanel={() => {
						setUserAdding(false);
					}}
					depId={departamentData.id}
					updateDepartamentData={(newUser: {
						id: number;
						username: string;
						role: string;
					}) => {
						const newDepUser = {
							userId: newUser.id,
							departamentId: departamentData.id,
							user: {
								id: newUser.id,
								username: newUser.username,
								role: newUser.role,
							},
						};

						if (departamentData) {
							const newUsersArray = [...departamentData.users, newDepUser];
							setDepartamentData({
								...departamentData,
								users: newUsersArray ?? [],
							});
						}
					}}
				/>
			)}
			<div className="px-4 py-6 md:px-6 md:py-12 lg:py-16">
				<div className="prose prose-gray mx-auto max-w-6xl">
					<div className="space-y-4">
						<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl lg:leading-[3.5rem]">
							{departamentData?.name}
						</h1>
						<p className="text-gray-500">{departamentData?.description}</p>
					</div>
				</div>
			</div>
			<div className="container mx-auto px-4 py-6 md:px-6 md:py-12 lg:py-16">
				<div className="w-full" defaultValue="articles">
					<div className="flex w-fit space-x-4 mb-6 bg-gray-200 p-2 text-base rounded-lg">
						<button
							className={`px-4  ${
								tabState == "ARTICLES" && "bg-white rounded-lg"
							}`}
							onClick={() => {
								setTabState("ARTICLES");
							}}
							value="articles"
						>
							Articles
						</button>
						<button
							className={`px-4  ${
								tabState == "LECTURERS" && "bg-white rounded-lg"
							}`}
							onClick={() => {
								setTabState("LECTURERS");
							}}
							value="lecturers"
						>
							Lecturers
						</button>
						<button
							className={`px-4  ${
								tabState == "USERS" && "bg-white rounded-lg"
							}`}
							onClick={() => {
								setTabState("USERS");
							}}
							value="users"
						>
							Users
						</button>
					</div>
					{tabState === "ARTICLES" && (
						<div className="first-tab space-y-6">
							{departamentData && (
								<ArticleList
									arrayOfLecturers={departamentData.lecturers.map(
										(lecturer) => {
											var ret: {
												id: string;
												fullname: string;
											};
											ret = {
												id: lecturer.sceintificDBData[0].id,
												fullname: lecturer.surname + " " + lecturer.name,
											};
											return ret;
										}
									)}
								/>
							)}
						</div>
					)}
					{tabState === "LECTURERS" && (
						<div className="space-y-6 second-tab">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-bold">Lecturers</h2>
								<button
									onClick={() => setLecturerCreationOpen(true)}
									className="text-lg font-light text-white py-2 px-4 bg-black rounded-lg"
								>
									Add Lecturer
								</button>
							</div>
							<table className="w-full">
								<thead className="text-gray-400 text-base">
									<tr className="hover:bg-gray-200 transition ease-in">
										<th className="py-4 w-[200px] font-light  text-center">
											Surname
										</th>
										<th className="py-4 w-[200px] font-light  text-center">
											Name
										</th>
										<th className="py-4 w-[100px] font-light text-center">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="text-xl font-light">
									{departamentData?.lecturers.map((lecturer) => {
										return (
											<tr
												key={lecturer.id}
												className="border-t border-gray-300 hover:bg-gray-200 transition ease-in"
											>
												<td className="py-3 text-center">{lecturer.surname}</td>
												<td className="py-3 text-center">{lecturer.name}</td>
												<td className="py-3 text-center flex justify-center gap-4">
													<button
														onClick={() => handleLecturerDeletion(lecturer.id)}
														className="text-lg font-light bg-gray-100 text-black py-2 px-4 border border-gray-200 shadow-md  rounded-lg"
													>
														Delete
													</button>
													<a
														href={`/author/${lecturer.sceintificDBData[0].id}`}
														className="text-lg font-light bg-gray-100 text-black py-2 px-4 border border-gray-200 shadow-md  rounded-lg"
													>
														Details
													</a>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}

					{tabState === "USERS" && (
						<div className="space-y-6 third-tab">
							<div className="flex items-center justify-between mb-4">
								<h2 className="text-2xl font-bold">Users</h2>
								<button
									onClick={() => setUserAdding(true)}
									className="text-lg font-light text-white py-2 px-4 bg-black rounded-lg"
								>
									Add User
								</button>
							</div>
							<table className="w-full">
								<thead className="text-gray-400 text-base">
									<tr className=" hover:bg-gray-200 transition ease-in">
										<th className="font-light w-[200px] py-4 text-center ">
											Username
										</th>
										<th className="font-light py-4 text-center">Role</th>
										<th className="font-light w-[100px] py-4 text-center">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="text-xl font-light">
									{departamentData?.users.map((user) => {
										return (
											<tr
												key={user.userId}
												className="border-t border-gray-300  hover:bg-gray-200 transition ease-in "
											>
												<td className="py-3 text-center">
													{user.user.username}
												</td>
												<td className="py-3 text-center">{user.user.role}</td>
												<td className="py-3 text-center flex justify-center">
													<button
														onClick={() =>
															handleUserDeletion(user.user.username)
														}
														className="text-lg font-light bg-gray-100 text-black py-2 px-4 border border-gray-200 shadow-md  rounded-lg"
													>
														Delete
													</button>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					)}
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
		</>
	);
}
type Source = "SCHOLAR" | "SCOPUS";

interface LecturerCreationData {
	name: string;
	surname: string;
	departamentId: number;
	sceintificDBData: {
		id: string;
		source: Source;
	};
}

export function cutNameFromGoogleStupidApi(inputString: string) {
	const symbolsToCheck = [",", "(", "/"];

	// Initialize the index variable
	let index = inputString.length;

	// Loop through each symbol to find the earliest occurrence
	for (let symbol of symbolsToCheck) {
		const symbolIndex = inputString.indexOf(symbol);
		if (symbolIndex !== -1 && symbolIndex < index) {
			index = symbolIndex;
		}
	}

	// Take the substring before the earliest occurrence of any symbol
	return inputString.substring(0, index);
}

export function deleteSubstring(inputString: string) {
	// Find the index of the last comma
	let lastIndex: number = inputString.lastIndexOf(",");

	inputString = inputString.charAt(0).toUpperCase() + inputString.slice(1);

	// Check if comma exists in the string
	if (lastIndex !== -1) {
		// Extract substring before the last comma
		let substring: string = inputString.substring(0, lastIndex);

		// Print the substring

		return substring;
	} else {
		return inputString;
	}
}

function LecturerCreation({
	closeCreationPanel,
	depId,
	updateDepartamentData,
}: {
	closeCreationPanel: () => void;
	depId: number;
	updateDepartamentData: (newLecturer: {
		id: number;
		name: string;
		surname: string;
		departamentId: number;
		sceintificDBData: {
			id: string;
			source: "SCHOLAR";
		}[];
	}) => void;
}) {
	const [profiles, setProfiles] = useState<[tProfile]>();
	const [lecturerName, setLecturerName] = useState("");
	const [lecturerSurname, setLecturerSurname] = useState("");
	const [error, setError] = useState("");
	const [responce, setResponce] = useState("");

	const [stage, setStage] = useState<"START" | "FINISH">("START");
	const [lecturerScholarId, setLecturerScholarId] = useState("");

	function handleLecturerScolarSearch() {
		(async () => {
			const response = await fetch(
				`http://localhost:3000/api/scholar/profiles`,
				{
					method: "POST",
					credentials: "include",
					body: JSON.stringify({
						query: lecturerName + " " + lecturerSurname,
					}),
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
				}
			).then(async (res) => {
				return await res.json();
			});

			setProfiles(response);
		})();
	}

	function handleLecturerCreation() {
		(async () => {
			const body: LecturerCreationData = {
				name: lecturerName,
				surname: lecturerSurname,
				sceintificDBData: {
					id: lecturerScholarId,
					source: "SCHOLAR",
				},
				departamentId: depId,
			};
			await fetch("http://localhost:3000/api/lecturer/create", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify(body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();

					updateDepartamentData({
						...resJson,
						sceintificDBData: [{ id: lecturerScholarId, source: "SCHOLAR" }],
					});
					setResponce("Lecturer created");
					setTimeout(() => closeCreationPanel(), 1000);
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
			<div className="p-6 bg-white rounded-md mx-auto w-full max-w-4xl space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Create New Lecturer</h1>
					<p className="text-gray-500 dark:text-gray-400">
						Fill out the form to add a new lecturer.
					</p>
				</div>
				<div className="space-y-4 text-lg font-light">
					<div className="space-y-2">
						<label htmlFor="name">Name</label>
						<input
							value={lecturerName}
							onChange={(e) => {
								setLecturerName(e.target.value);
							}}
							id="name"
							required
							placeholder="Enter a name"
							className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
						/>
					</div>
					<div className="space-y-2">
						<label htmlFor="name">Surname</label>
						<input
							value={lecturerSurname}
							onChange={(e) => {
								setLecturerSurname(e.target.value);
							}}
							id="name"
							required
							placeholder="Enter a name"
							className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
						/>
					</div>
					{profiles && (
						<div className="max-h-96 space-y-2 border border-solid w-full border-gray-300 rounded-lg p-4 overflow-y-scroll">
							{profiles.map((profile) => {
								return (
									<div className="flex border-b border-gray-200 w-full justify-between items-center ">
										<div key={profile.author_id} className="">
											<h2 className="text-xl font-medium">
												<a
													target="_blank"
													href={`/author/${profile.author_id}`}
												>
													{cutNameFromGoogleStupidApi(profile.name)}
												</a>
											</h2>
											<p>{deleteSubstring(profile.affiliations)}</p>
										</div>
										<div>
											<button
												onClick={() => {
													setStage("FINISH");
													setLecturerScholarId(profile.author_id);
												}}
												className="text-lg font-light bg-gray-100 text-black py-2 px-4 border border-gray-200 shadow-md rounded-lg hover:bg-gray-500 hover:text-white"
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
													<path d="M20 6 9 17l-5-5" />
												</svg>
											</button>
										</div>
									</div>
								);
							})}
						</div>
					)}

					{lecturerScholarId && (
						<div className="space-y-2">
							<label htmlFor="name">Scholar Id</label>
							<p className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg">
								{lecturerScholarId}
							</p>
							{/* <input
								value={lecturerSurname}
								onChange={(e) => setLecturerSurname(e.target.value)}
								id="name"
								required
								placeholder="Enter a name"
								className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
							/> */}
						</div>
					)}
					<div className="flex gap-2">
						<button
							onClick={handleLecturerScolarSearch}
							className="py-2 card-footer w-full bg-black rounded-lg text-white"
						>
							Find
						</button>

						{stage == "FINISH" && (
							<button
								onClick={handleLecturerCreation}
								className="py-2 card-footer w-full bg-black rounded-lg text-white"
							>
								Create Item
							</button>
						)}
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
			</div>
		</div>
	);
}

interface UserAddToDepasrtament {
	username: string;
	departamentId: number;
}

function UserAddToDepartament({
	closeCreationPanel,
	depId,
	updateDepartamentData,
}: {
	closeCreationPanel: () => void;
	depId: number;
	updateDepartamentData: (newLecturer: {
		id: number;
		username: string;
		role: string;
	}) => void;
}) {
	const [username, setUsername] = useState("");
	const [error, setError] = useState("");
	const [responce, setResponce] = useState("");

	function handleUserAddition() {
		(async () => {
			const body: UserAddToDepasrtament = {
				username: username,
				departamentId: depId,
			};
			await fetch("http://localhost:3000/api/addToDepartament", {
				method: "POST",
				credentials: "include",
				body: JSON.stringify(body),
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
			}).then(async (res) => {
				if (res.ok) {
					const resJson = await res.json();

					updateDepartamentData(resJson);
					setResponce("User added");
					setTimeout(() => closeCreationPanel(), 500);
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

			<div className="p-6 bg-white rounded-md mx-auto w-full max-w-lg space-y-6">
				<div className="space-y-2 text-center">
					<h1 className="text-3xl font-bold">Add New User</h1>
				</div>
				<div className="space-y-4 text-lg font-light">
					<div className="space-y-2">
						<label htmlFor="name">Username</label>
						<input
							value={username}
							onChange={(e) => {
								setUsername(e.target.value);
							}}
							id="name"
							required
							placeholder="Enter a name"
							className="py-2 px-4 border border-solid w-full border-gray-300 rounded-lg"
						/>
					</div>

					<button
						onClick={handleUserAddition}
						className="py-2 card-footer w-full bg-black rounded-lg text-white"
					>
						Add User
					</button>

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
			</div>
		</div>
	);
}
