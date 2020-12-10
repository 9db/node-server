import HttpMethod from 'http/enum/method';
import StatusCode from 'http/enum/status-code';
import ContentType from 'http/enum/content-type';

interface Route {
	getContentType(): ContentType;
	getMethod(): HttpMethod;
	getSuccessfulStatusCode(): StatusCode;
	getUrlParameter(url: string, parameter: string): string | undefined;
}

export default Route;
