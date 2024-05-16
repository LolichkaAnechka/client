export interface tAuthor {
	name: string;
	affiliations: string;
	email: string;
	interests: [tInterests];
	thumbnail: string;
	articles: [tArticle];
}

export interface tArticle {
	title: string;
	link: string;
	citation_id: string;
	authors: string;
	publication: string;
	year: string;
	cited_by: tCitedBy;
}

export interface tCitedBy {
	value: number;
	link: string;
	serpapi_link: string;
}

export interface tScholarOrganic {
	title: string;
	summary: string;
	link: string;
	authors?: [tOrganicAuthor];
	source: "Schoolar";
}

export interface tOrganicAuthor {
	name: string;
	link: string;
	serpapi_scholar_link: string;
}

export interface tProfile {
	name: string;
	link: string;
	author_id: string;
	affiliations: string;
	email: string;
	interests?: [tInterests];
	thumbnail: string;
}

export interface tInterests {
	title: string;
	link: string;
	serpapi_scholar_link: string;
}

export interface UserCreationData {
	username: string;
	password: string;
	role: Role;
	departamentId: number;
}

export enum Role {
	USER,
	ADMIN,
	GOD,
}
