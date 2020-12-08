import HttpHeader from 'http/enum/header';

type HeaderMap = {
	[key in HttpHeader]?: string;
};

export default HeaderMap;
