import { useState } from "react";
import { AuthorCard } from "./AuthorCard";

export function ArticleList({
	arrayOfLecturers,
}: {
	arrayOfLecturers: {
		id: string;
		fullname: string;
	}[];
}) {
	const [titleFilter, setTitleFilter] = useState("");
	const [authorFilter, setAuthorFilter] = useState("");
	const [yearFilter, setYearFilter] = useState("");

	return (
		<div className="space-y-4">
			<div className="bg-white rounded-lg shadow-md p-6">
				<div className="flex items-center justify-between mb-6">
					<h2 className="text-2xl font-bold ">Filter</h2>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-gray-700 font-medium" htmlFor="title">
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
							<label className="text-gray-700 font-medium" htmlFor="author">
								Author
							</label>
						</div>
						<input
							value={authorFilter}
							onChange={(e) => setAuthorFilter(e.target.value)}
							className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 "
							id="author"
							placeholder="Enter author"
							type="text"
						/>
					</div>
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<label className="text-gray-700 font-medium" htmlFor="year">
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
			<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{arrayOfLecturers.map((author) => {
					if (author.fullname.includes(authorFilter)) {
						return (
							<AuthorCard
								key={author.id}
								author={author}
								titleFilter={titleFilter}
								yearFilter={yearFilter}
							/>
						);
					}
				})}
			</div>
		</div>
	);
}
