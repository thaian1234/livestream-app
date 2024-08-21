// HTTP status codes as registered with IANA.
// See: https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
export enum HttpStatus {
    Continue = 100, // RFC 9110, 15.2.1
    SwitchingProtocols = 101, // RFC 9110, 15.2.2
    Processing = 102, // RFC 2518, 10.1
    EarlyHints = 103, // RFC 8297
    OK = 200, // RFC 9110, 15.3.1
    Created = 201, // RFC 9110, 15.3.2
    Accepted = 202, // RFC 9110, 15.3.3
    NonAuthoritativeInfo = 203, // RFC 9110, 15.3.4
    NoContent = 204, // RFC 9110, 15.3.5
    ResetContent = 205, // RFC 9110, 15.3.6
    PartialContent = 206, // RFC 9110, 15.3.7
    MultiStatus = 207, // RFC 4918, 11.1
    AlreadyReported = 208, // RFC 5842, 7.1
    IMUsed = 226, // RFC 3229, 10.4.1
    MultipleChoices = 300, // RFC 9110, 15.4.1
    MovedPermanently = 301, // RFC 9110, 15.4.2
    Found = 302, // RFC 9110, 15.4.3
    SeeOther = 303, // RFC 9110, 15.4.4
    NotModified = 304, // RFC 9110, 15.4.5
    UseProxy = 305, // RFC 9110, 15.4.6
    TemporaryRedirect = 307, // RFC 9110, 15.4.8
    PermanentRedirect = 308, // RFC 9110, 15.4.9
    BadRequest = 400, // RFC 9110, 15.5.1
    Unauthorized = 401, // RFC 9110, 15.5.2
    PaymentRequired = 402, // RFC 9110, 15.5.3
    Forbidden = 403, // RFC 9110, 15.5.4
    NotFound = 404, // RFC 9110, 15.5.5
    MethodNotAllowed = 405, // RFC 9110, 15.5.6
    NotAcceptable = 406, // RFC 9110, 15.5.7
    ProxyAuthRequired = 407, // RFC 9110, 15.5.8
    RequestTimeout = 408, // RFC 9110, 15.5.9
    Conflict = 409, // RFC 9110, 15.5.10
    Gone = 410, // RFC 9110, 15.5.11
    LengthRequired = 411, // RFC 9110, 15.5.12
    PreconditionFailed = 412, // RFC 9110, 15.5.13
    RequestEntityTooLarge = 413, // RFC 9110, 15.5.14
    RequestURITooLong = 414, // RFC 9110, 15.5.15
    UnsupportedMediaType = 415, // RFC 9110, 15.5.16
    RequestedRangeNotSatisfiable = 416, // RFC 9110, 15.5.17
    ExpectationFailed = 417, // RFC 9110, 15.5.18
    Teapot = 418, // RFC 9110, 15.5.19 (Unused)
    MisdirectedRequest = 421, // RFC 9110, 15.5.20
    UnprocessableEntity = 422, // RFC 9110, 15.5.21
    Locked = 423, // RFC 4918, 11.3
    FailedDependency = 424, // RFC 4918, 11.4
    TooEarly = 425, // RFC 8470, 5.2.
    UpgradeRequired = 426, // RFC 9110, 15.5.22
    PreconditionRequired = 428, // RFC 6585, 3
    TooManyRequests = 429, // RFC 6585, 4
    RequestHeaderFieldsTooLarge = 431, // RFC 6585, 5
    UnavailableForLegalReasons = 451, // RFC 7725, 3
    InternalServerError = 500, // RFC 9110, 15.6.1
    NotImplemented = 501, // RFC 9110, 15.6.2
    BadGateway = 502, // RFC 9110, 15.6.3
    ServiceUnavailable = 503, // RFC 9110, 15.6.4
    GatewayTimeout = 504, // RFC 9110, 15.6.5
    HTTPVersionNotSupported = 505, // RFC 9110, 15.6.6
    VariantAlsoNegotiates = 506, // RFC 2295, 8.1
    InsufficientStorage = 507, // RFC 4918, 11.5
    LoopDetected = 508, // RFC 5842, 7.2
    NotExtended = 510, // RFC 2774, 7
    NetworkAuthenticationRequired = 511, // RFC 6585, 6
}

// StatusText returns a text for the HTTP status code. It returns the empty
// string if the code is unknown.
export function statusText(code: number): string {
    switch (code) {
        case HttpStatus.Continue:
            return "Continue";
        case HttpStatus.SwitchingProtocols:
            return "Switching Protocols";
        case HttpStatus.Processing:
            return "Processing";
        case HttpStatus.EarlyHints:
            return "Early Hints";
        case HttpStatus.OK:
            return "OK";
        case HttpStatus.Created:
            return "Created";
        case HttpStatus.Accepted:
            return "Accepted";
        case HttpStatus.NonAuthoritativeInfo:
            return "Non-Authoritative Information";
        case HttpStatus.NoContent:
            return "No Content";
        case HttpStatus.ResetContent:
            return "Reset Content";
        case HttpStatus.PartialContent:
            return "Partial Content";
        case HttpStatus.MultiStatus:
            return "Multi-Status";
        case HttpStatus.AlreadyReported:
            return "Already Reported";
        case HttpStatus.IMUsed:
            return "IM Used";
        case HttpStatus.MultipleChoices:
            return "Multiple Choices";
        case HttpStatus.MovedPermanently:
            return "Moved Permanently";
        case HttpStatus.Found:
            return "Found";
        case HttpStatus.SeeOther:
            return "See Other";
        case HttpStatus.NotModified:
            return "Not Modified";
        case HttpStatus.UseProxy:
            return "Use Proxy";
        case HttpStatus.TemporaryRedirect:
            return "Temporary Redirect";
        case HttpStatus.PermanentRedirect:
            return "Permanent Redirect";
        case HttpStatus.BadRequest:
            return "Bad Request";
        case HttpStatus.Unauthorized:
            return "Unauthorized";
        case HttpStatus.PaymentRequired:
            return "Payment Required";
        case HttpStatus.Forbidden:
            return "Forbidden";
        case HttpStatus.NotFound:
            return "Not Found";
        case HttpStatus.MethodNotAllowed:
            return "Method Not Allowed";
        case HttpStatus.NotAcceptable:
            return "Not Acceptable";
        case HttpStatus.ProxyAuthRequired:
            return "Proxy Authentication Required";
        case HttpStatus.RequestTimeout:
            return "Request Timeout";
        case HttpStatus.Conflict:
            return "Conflict";
        case HttpStatus.Gone:
            return "Gone";
        case HttpStatus.LengthRequired:
            return "Length Required";
        case HttpStatus.PreconditionFailed:
            return "Precondition Failed";
        case HttpStatus.RequestEntityTooLarge:
            return "Request Entity Too Large";
        case HttpStatus.RequestURITooLong:
            return "Request URI Too Long";
        case HttpStatus.UnsupportedMediaType:
            return "Unsupported Media Type";
        case HttpStatus.RequestedRangeNotSatisfiable:
            return "Requested Range Not Satisfiable";
        case HttpStatus.ExpectationFailed:
            return "Expectation Failed";
        case HttpStatus.Teapot:
            return "I'm a teapot";
        case HttpStatus.MisdirectedRequest:
            return "Misdirected Request";
        case HttpStatus.UnprocessableEntity:
            return "Unprocessable Entity";
        case HttpStatus.Locked:
            return "Locked";
        case HttpStatus.FailedDependency:
            return "Failed Dependency";
        case HttpStatus.TooEarly:
            return "Too Early";
        case HttpStatus.UpgradeRequired:
            return "Upgrade Required";
        case HttpStatus.PreconditionRequired:
            return "Precondition Required";
        case HttpStatus.TooManyRequests:
            return "Too Many Requests";
        case HttpStatus.RequestHeaderFieldsTooLarge:
            return "Request Header Fields Too Large";
        case HttpStatus.UnavailableForLegalReasons:
            return "Unavailable For Legal Reasons";
        case HttpStatus.InternalServerError:
            return "Internal Server Error";
        case HttpStatus.NotImplemented:
            return "Not Implemented";
        case HttpStatus.BadGateway:
            return "Bad Gateway";
        case HttpStatus.ServiceUnavailable:
            return "Service Unavailable";
        case HttpStatus.GatewayTimeout:
            return "Gateway Timeout";
        case HttpStatus.HTTPVersionNotSupported:
            return "HTTP Version Not Supported";
        case HttpStatus.VariantAlsoNegotiates:
            return "Variant Also Negotiates";
        case HttpStatus.InsufficientStorage:
            return "Insufficient Storage";
        case HttpStatus.LoopDetected:
            return "Loop Detected";
        case HttpStatus.NotExtended:
            return "Not Extended";
        case HttpStatus.NetworkAuthenticationRequired:
            return "Network Authentication Required";
        default:
            return "";
    }
}
