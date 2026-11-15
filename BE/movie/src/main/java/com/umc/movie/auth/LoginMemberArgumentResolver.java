package com.umc.movie.auth;

import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.exception.ApiException;
import org.springframework.core.MethodParameter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.*;
import org.springframework.web.method.support.*;

public class LoginMemberArgumentResolver implements HandlerMethodArgumentResolver {
    public boolean supportsParameter(MethodParameter p) {
        return p.hasParameterAnnotation(LoginMember.class) && p.getParameterType().equals(Long.class);
    }

    public Object resolveArgument(MethodParameter p, ModelAndViewContainer c, NativeWebRequest r, WebDataBinderFactory b) {
        Object id = r.getAttribute(AuthInterceptor.MEMBER_ID, RequestAttributes.SCOPE_REQUEST);
        if (!(id instanceof Long)) throw new ApiException(HttpStatus.UNAUTHORIZED, "AUTH401_2", "로그인이 필요한 요청입니다.");
        return id;
    }
}