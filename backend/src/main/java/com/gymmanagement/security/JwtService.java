package com.gymmanagement.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.util.function.Function;

import java.security.Key;
import java.util.Date;

@Service
public class JwtService{

private static final String SECRET =
        "mySuperSecretKeyForGymManagementSystem123456789";

private final Key key = Keys.hmacShaKeyFor(SECRET.getBytes());

public String generateToken(String username) {
    return generateToken(username, "auth");
}

public String generateToken(String username, String tokenType) {
    return Jwts.builder()
            .setSubject(username)
            .claim("type", tokenType)
            .setIssuedAt(new Date())
            .setExpiration(
                    new Date(System.currentTimeMillis() + 1000 * 60 * 60)
            )
            .signWith(key, SignatureAlgorithm.HS256)
            .compact();
}

public String extractTokenType(String token) {
    return extractClaim(token, claims -> claims.get("type", String.class));
}

private Claims extractAllClaims(String token) {

    return Jwts
            .parserBuilder()
            .setSigningKey(key)
            .build()
            .parseClaimsJws(token)
            .getBody();
}
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }
    public boolean isTokenValid(String token, UserDetails userDetails) {

        final String username = extractUsername(token);

        return username.equals(userDetails.getUsername())
                && !isTokenExpired(token);
    }

    public boolean isAuthTokenValid(String token, UserDetails userDetails) {
        return "auth".equals(extractTokenType(token))
                && isTokenValid(token, userDetails);
    }

public <T> T extractClaim(
        String token,
        Function<Claims, T> claimsResolver) {

    final Claims claims = extractAllClaims(token);

    return claimsResolver.apply(claims);
}}