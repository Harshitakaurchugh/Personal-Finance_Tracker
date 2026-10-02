package com.finance.tracker.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;

import com.finance.tracker.entity.User;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long jwtExpirationInMs;

    /**
     * Generate JWT Token for application User entity
     */
    public String generateToken(User user) {

        return Jwts.builder()

                .claims(Map.of("email", user.getEmail(), 
                "role", user.getRole().name()))

                .subject(user.getEmail().toString())

                .issuedAt(new Date(System.currentTimeMillis()))

                .expiration(
                        new Date(System.currentTimeMillis()
                                + jwtExpirationInMs))

                .signWith(getSigningKey(), SignatureAlgorithm.HS256)

                .compact();
    }

    /**   
     * Extract subject from token
     */
    public String extractSubject(String token) {

        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract Expiration
     */
    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Generic Claim Extractor
     */
    public <T> T extractClaim(
            String token,
            Function<Claims, T> claimsResolver) {

        final Claims claims = extractAllClaims(token);

        return claimsResolver.apply(claims);
    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(
            String token,
            User user) {

        final String subject = extractSubject(token);

        return subject.equals(user.getEmail())
                && !isTokenExpired(token);
    }

    /**
     * Check Expiry
     */
    private boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    /**
     * Parse Token
     */
    private Claims extractAllClaims(String token) {

        return Jwts.parser()

                .setSigningKey(getSigningKey())

                .build()

                .parseClaimsJws(token)

                .getBody();
    }

    /**
     * Signing Key
     */
    private Key getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(secretKey);

        return Keys.hmacShaKeyFor(keyBytes);
    }
}
