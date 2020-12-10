interface Route {
	getUrlParameter(url: string, parameter: string): string | undefined;
}

export default Route;
