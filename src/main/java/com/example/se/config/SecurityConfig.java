package com.example.se.config;

import com.example.se.controller.CustomAuthenticationFailureHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
@EnableWebSecurity
@Configuration
public class SecurityConfig {

    @Autowired
    CustomAuthenticationFailureHandler customAuthenticationFailureHandler;
    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception
    {
        httpSecurity
                .formLogin(form -> form
                        .loginProcessingUrl("/authenticateTheUser")
                        .failureHandler(customAuthenticationFailureHandler)
                        .loginPage("/login").permitAll());

        httpSecurity
                .authorizeHttpRequests(auth->auth
                        .requestMatchers("/login").anonymous()
                        .anyRequest()
                            .authenticated());

        httpSecurity
                .logout(logout -> logout
                        .deleteCookies("remember-me")
                        .permitAll());

        httpSecurity
                .rememberMe(rememberMe -> rememberMe
                        .tokenValiditySeconds(3600*24*30));

        return httpSecurity.build();

//        return http
//                .formLogin(form->form.loginPage("/login").permitAll())
//                .authorizeHttpRequests(auth->auth.anyRequest().authenticated())
//                .build();
    }

}
