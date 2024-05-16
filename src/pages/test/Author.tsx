import { useEffect, useState } from "react";
import { tAuthor } from "../../types/Types";
import { useNavigate, useParams } from "react-router-dom";
import { cutNameFromGoogleStupidApi, deleteSubstring } from "./SearchPage";

const BASE_URL = "http://localhost:3000/api/";

function Author() {
	const [authorResponce, setAuthorResponce] = useState<tAuthor>();

	const [titleFilter, setTitleFilter] = useState("");
	const [yearFilter, setYearFilter] = useState("");
	let params = useParams();

	const nav = useNavigate();
	useEffect(() => {
		(async () => {
			const response = await fetch(
				BASE_URL + `scholar/author/${params.authorID}`,
				{
					method: "GET",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					credentials: "include",
				}
			).then(async (res) => {
				if (res.ok) {
					return await res.json();
				} else {
					const resp = await res.json();
					if (resp.redirect) {
						nav(resp.redirect);
					}
				}
			});
			console.log(response);

			setAuthorResponce(response);
		})();
	}, []);

	return (
		<main className="max-w-6xl font-inter mx-auto px-4 py-8 sm:px-6 lg:px-8">
			{authorResponce && (
				<div className="flex flex-col gap-12">
					<div className="flex flex-col items-center text-right">
						<img
							className="rounded-full"
							height={200}
							src={authorResponce.thumbnail}
							style={{
								aspectRatio: "200/200",
								objectFit: "cover",
							}}
							width={200}
						/>
						<h1 className="text-2xl font-bold mt-4 ">
							{cutNameFromGoogleStupidApi(authorResponce.name)}
						</h1>
						<div className="text-gray-500 text-lg mt-2 text-right ">
							<p className="text-right">{authorResponce.affiliations}</p>
						</div>
					</div>
					<div>
						<div className="space-y-4">
							<h2 className="text-xl font-bold">Interests</h2>
							<div className="flex flex-wrap gap-2">
								{authorResponce.interests.map((int) => {
									return (
										<div className="text-xs px-2 py-1 bg-gray-300 rounded-xl">
											<a target="_blank" href={int.link}>
												{int.title}
											</a>
										</div>
									);
								})}
							</div>
						</div>
						<div className="separator my-8" />
						<div className="space-y-4">
							<h2 className="text-xl font-bold">Published Articles</h2>

							<div className="bg-white rounded-lg shadow-md p-6">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-2xl font-bold ">Filter</h2>
								</div>
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<label
												className="text-gray-700 font-medium text-base"
												htmlFor="title"
											>
												Title
											</label>
										</div>
										<input
											value={titleFilter}
											onChange={(e) => setTitleFilter(e.target.value)}
											className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2"
											id="title"
											placeholder="Enter title"
											type="text"
										/>
									</div>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<label
												className="text-gray-700 font-medium text-base"
												htmlFor="year"
											>
												Year
											</label>
										</div>
										<input
											value={yearFilter}
											onChange={(e) => setYearFilter(e.target.value)}
											className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 "
											id="year"
											placeholder="Enter year"
											type="number"
										/>
									</div>
								</div>
							</div>
							<div className="space-y-4">
								{authorResponce.articles.map((article) => {
									if (
										article.title.includes(titleFilter) &&
										(article.year == yearFilter || yearFilter == "")
									) {
										return (
											<div className="space-y-10 flex flex-col justify-between p-6 shadow-md border border-gray-200 bg-white rounded-lg">
												<h2 className="text-3xl font-bold">
													<a
														href={article.link}
														target="_blank"
														rel="noopener noreferrer"
													>
														{article.title}
													</a>
												</h2>
												<div className="description text-sm text-gray-500">
													<span className="">{article.authors}</span>
													<span className="mx-2">•</span>

													<span>{article.year}</span>
												</div>
											</div>
										);
									}
								})}
							</div>
						</div>
					</div>
				</div>
			)}
		</main>
	);
}

export default Author;
