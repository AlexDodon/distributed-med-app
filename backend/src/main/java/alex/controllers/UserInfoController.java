package alex.controllers;

import static com.auth0.jwt.algorithms.Algorithm.HMAC512;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.auth0.jwt.JWT;

import alex.model.User;
import alex.repositories.UserRepository;
import alex.security.JwtProperties;

@RepositoryRestController
@RequestMapping("/userInfo")
public class UserInfoController {

	@Autowired
	UserRepository ur;

	@Transactional
    @RequestMapping(method = RequestMethod.GET)
	@ResponseBody User getUserInfo(@RequestHeader(JwtProperties.HEADER_STRING) String token) {
		token = token.replace(JwtProperties.TOKEN_PREFIX,"");
		
		if (token != null) {
			String userName = JWT.require(HMAC512(JwtProperties.SECRET.getBytes()))
			.build()
			.verify(token)
			.getSubject();
			
			if (userName != null) {
			    return ur.findByUsername(userName);
			}
		}
		
		return null;
	}
}
