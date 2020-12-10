import ContentType from 'http/enum/content-type';

interface Route {
	getContentType(): ContentType;
	getUrlParameter(url: string, parameter: string): string | undefined;
}

export default Route;
