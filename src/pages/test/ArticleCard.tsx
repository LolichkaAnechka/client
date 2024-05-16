import { useEffect } from "react";

export function ArticleCard({
	authorId,
	articleInfo,
}: {
	authorId: string;
	articleInfo: {
		title: string;
		link: string;
		author: string;
		year: string;
	};
}) {
	useEffect(() => {}, []);
	return (
		<div className="card space-y-10 flex flex-col justify-between p-6 shadow-md border border-gray-200 bg-white rounded-lg">
			<div className="space-y-2 cardHeader">
				<h2 className="text-3xl font-bold">{articleInfo.title}</h2>
			</div>
			<div className="cardFooter ">
				<div className="flex items-center justify-between">
					<div className="text-sm text-gray-500">
						<span>
							<a target="_blank" href={`/author/${authorId}`}>
								{articleInfo.author}
							</a>
						</span>
						<span className="mx-2">•</span>
						<span>{articleInfo.year}</span>
					</div>
					<button className="text-lg hover:underline text-bold">
						<a target="_blank" href={articleInfo.link}>
							Read More
						</a>
					</button>
				</div>
			</div>
		</div>
	);
}
