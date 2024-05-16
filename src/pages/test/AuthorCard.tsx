import { useEffect, useState } from "react";
import { ArticleCard } from "./ArticleCard";
import { tAuthor } from "../../types/Types";

export function AuthorCard({
	author,
	titleFilter,
	yearFilter,
}: {
	author: {
		id: string;
		fullname: string;
	};
	titleFilter: string;
	yearFilter: string;
}) {
	const [authorData, setAuthorsData] = useState<tAuthor>();

	useEffect(() => {
		(async () => {
			await fetch(`http://localhost:3000/api/scholar/author/${author.id}`, {
				method: "GET",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				credentials: "include",
			}).then(async (res) => {
				const authorDataJSON = await res.json();
				authorDataJSON.name = author.fullname;
				setAuthorsData(authorDataJSON);
			});
		})();
	}, []);

	return (
		<>
			{authorData?.articles.map((article) => {
				if (
					article.title.includes(titleFilter) &&
					(article.year == yearFilter || yearFilter == "")
				) {
					return (
						<ArticleCard
							key={article.citation_id}
							articleInfo={{
								title: article.title,
								link: article.link,
								author: authorData.name,

								year: article.year,
							}}
							authorId={author.id}
						/>
					);
				}
			})}
		</>
	);
}
