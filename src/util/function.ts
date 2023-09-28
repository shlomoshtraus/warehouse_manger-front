import {GraphQLClient} from "graphql-request";

export function jsonParser(json: string) {
	return JSON.parse((JSON.stringify(json)));
}


export function checkInput(values: string[]) {
	let isNun = true;
	for (const value of values) {
		if (value) {
			isNun = isNun && /^\d+$/.test(value);
		}
	}
	return isNun;
}

export function createGraphqlClient(token?: string) {
	const endpoint = process.env.NODE_ENV === "production" ? process.env.REACT_APP_DB_URL! : "http://localhost:3001/server";
	if (!token)
		return new GraphQLClient(endpoint);
	return new GraphQLClient(endpoint, {headers: {Authorization: "Bearer " + token}});
}