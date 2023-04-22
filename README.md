# Authorization Code flow with PKCE

## Abstract

This document will provide a comprehensive guide on how to secure a JavaScript application using the OAuth2.0 Authorization Code Flow with PKCE extension, its benefits, and its implementation. It outlines the steps involved in obtaining tokens from the authorization server directly, without the need for an intermediate proxy server or backend component, and demonstrates how to use the token to access a protected resource.

While this document aims to provide a practical understanding of the authorization code flow process, it is important to note that additional measures, such as rate control mechanisms and validations, may need to be implemented to ensure optimum security.

## Table of contents

- [Authorization Code flow with PKCE](#authorization-code-flow-with-pkce)
  - [Abstract](#abstract)
  - [Table of contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Overview](#overview)
  - [Server Architecture](#server-architecture)
    - [Server Folder structure](#server-folder-structure)
  - [Getting started](#getting-started)
  - [Authorization Server](#authorization-server)
    - [Proof Key for Code Exchange](#proof-key-for-code-exchange)
    - [Authorization Endpoint](#authorization-endpoint)
    - [Authentication](#authentication)
    - [Token Endpoint](#token-endpoint)
      - [JWT Access Token](#jwt-access-token)
  - [Token Introspection](#token-introspection)
  - [Token Revocation](#token-revocation)
  - [Protected Resource Server](#protected-resource-server)
  - [Client App](#client-app)
    - [Client Folder structure](#client-folder-structure)
  - [Conclusion](#conclusion)
  - [References](#references)
  - [Author](#author)

## Introduction

In today's world, securing browser-based applications is crucial to protect sensitive information from unauthorized access. The OAuth 2.0 authorization framework is a widely used industry standard for securing web applications. This document provides a comprehensive guide on how to secure a JavaScript application using the OAuth 2.0 authorization code flow with PKCE extension.

The authorization code flow with PKCE extension provides an additional layer of security to prevent malicious attacks by unauthorized clients. By following the steps outlined in this document, you can obtain tokens from the authorization server directly, without the need for an intermediate proxy server or backend component, and use the token to access a protected resource.

In the following sections, this document provides an overview of the OAuth 2.0 authorization framework, the architecture of a clean application oriented by domain, and the steps involved in implementing the authorization code flow with PKCE extension. It also covers best practices for securing browser-based apps and provides additional resources for further reading.

Whether you are a developer or security professional, this document will guide you through the process of securing a browser-based app using the OAuth 2.0 authorization code flow with PKCE extension.

## Overview

```sh

                      +---------------+           +--------------+
                      |               |           |              |
                      | Authorization |           |   Resource   |
                      |    Server     |           |    Server    |
                      |               |           |              |
                      +---------------+           +--------------+

                             ^     ^                 ^     +
                             |     |                 |     |
                             |(2)  |(3)              |(4)  |(5)
                             |     |                 |     |
                             |     |                 |     |
                             +     v                 +     v

+-----------------+         +-------------------------------+
|                 |   (1)   |                               |
| Static Web Host | +-----> |           Browser             |
|                 |         |                               |
+-----------------+         +-------------------------------+
```

The abstract OAuth 2.0 flow illustrated in this figure describes the interaction between the four roles and includes the following steps:

1. The JavaScript code is loaded from a static web host into the browser.
2. The code in the browser initiates the Authorization Code flow with the PKCE extension to obtain an authorization code from the Authorization Server.
3. The code exchanges the authorization code for an access token via a POST request to the Authorization Server.
4. The JavaScript application includes the access token in the request to the Resource Server to access protected resources.
5. The Resource Server sends a response back to the application with the requested resource.

## Server Architecture

The server architecture is designed using a clean architecture domain-oriented approach and implements API Rest Level 2. The application code is organized in a folder structure that separates different components of the application, making it easy to maintain and extend.

### Server Folder structure

```bash
└── app.js
└── config.js
└── index.js
└── src/
    └── api/
    └── domain/
    └── infrastructure/
        └── Repository.js
        └── database.js
    └── middlewares/
    └── utils/
    └── views/
```

The following is the representation of responsibilities and roles of each common folder and files for each server:

- `app.js`: Contains the main application code, including configuration and initialization of the server.
- `config.js`: Contains various configuration settings for the server, such as database connection strings, server port, and OAuth 2.0 client credentials.
- `index.js`: Sets up and starts the server, using the `app.js` and `config.js` files.
- `src`: Contains subdirectories for the various components of the application.
- `api`: Contains endpoint handlers for various OAuth 2.0 flows, such as authentication, authorization, token issuance, token revocation, and token introspection.
- `domain`: Contains subdirectories for entity classes and service classes, representing the core business logic of the application. This includes entities such as AuthorizationCode, Client, Token, and User, and services such as AuthorizationCodeService, ClientService, TokenService, and UserService.
- `infrastructure`: Contains utility classes for interacting with external resources, such as databases, caches, or message queues. This includes the `Repository` class for database interactions, and a `database.js` file for setting up the in-memory database connection.
- `middlewares`: Contains middleware functions for validating requests, such as checking authentication and authorization, and validating parameters for various endpoints.
- `utils`: Contains utility functions used throughout the application, such as a function for building redirect URLs.
- `views`: Contains HTML templates for various OAuth 2.0 flows, such as the authentication flow.

## Getting started

Clone this project:

```sh
git clone <insert-repo-here>
```

Install dependencies:

```sh
npm i 
```

Execute tests:

```sh
npm run test
```

## Authorization Server

The Authorization Server discussed here has implemented the Authorization Code Flow with Proof Key for Code Exchange (PKCE), which is an OAuth 2.0 extension that provides a higher level of security for exchanging authorization codes in public clients. This is especially crucial for native applications or single-page applications (SPAs) that are more susceptible to interception attacks. By implementing PKCE, the server can mitigate this risk and add an additional layer of security to the standard Authorization Code Flow.

### Proof Key for Code Exchange

The PKCE extension was introduced to prevent man-in-the-middle attacks and code interception in public clients. PKCE adds an extra layer of security by requiring clients to create and manage a unique secret called `code_verifier`, which must be cryptographically linked to the `code_challenge` parameter sent during the initial authorization request.

### Authorization Endpoint

The authorization endpoint is a crucial component of the OAuth 2.0 protocol, used to interact with the resource owner and obtain an authorization grant. Before granting access, the authorization server MUST first authenticate the resource owner.

To prepare the authorization parameters, the client should construct an authorization request URI using the following components:

- `response_type`: The desired grant type for the token exchange. For example, the "code" grant type is used for authorization codes.
- `client_id`: The identifier for the client application requesting access.
- `redirect_uri`: The URI to which the authorization server will redirect the user-agent after authorization is complete.
- `scope`: The permissions being requested by the client.
- `state`: An opaque value used by the client to maintain state between the request and callback.
- `code_challenge`: A code verifier generated by the client to ensure the integrity of the authorization request.

Here is an example request to the authorization endpoint:

```http
GET /authorize?response_type=code&client_id=1234567890&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb&scope=read write&state=af0ifjsldkj&code_challenge=OCCMZTGCmO52y-gG1uBtXbVtPjPhkwTmZkOhuudzPc HTTP/1.1
Host: server.example.com

```

### Authentication

Before granting an access token, the authorization server MUST first authenticate the resource owner. If the user is not authenticated, the authorization server will redirect them to an authentication page, where they will be prompted to provide their credentials.

Once the user submits their credentials and they are verified, the authorization server will issue an authorization code and redirect the user-agent to the `redirect_uri` provided by the client. *The authorization code* is a short-lived token that the client can exchange for an access token, which can then be used to access protected resources on behalf of the user.

### Token Endpoint

The token endpoint is a critical part of the OAuth 2.0 protocol, used by the client to obtain an access token from the authorization server. To obtain an access token, the client must present its authorization code grant and the corresponding code_verifier.

To request an access token you need to invoke the token endpoint with the following parameters:

- `grant_type`: The grant type of the authorization code. For example, "authorization_code" is used for authorization codes.
- `code`: The authorization code that was received from the authorization server.
- `redirect_uri`: The URI to which the authorization server will redirect the user-agent after authorization is complete.
- `code_verifier`: The code verifier that was generated by the client as part of the authorization request.

The following is an example request to the token endpoint:

```http
POST /token HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code
&code=SplxlOBeZQQYbYS6WxSbIA
&redirect_uri=https%3A%2F%2Fclient.example.com%2Fcb
&code_verifier=3641a2d12d66101249cdf7a79c000c1f8c05d2aafcf14bf146497bed
```

#### JWT Access Token

A JWT access token is a secure and compact way to represent access credentials in a token format. It consists of three parts: a header, a payload, and a signature. The header typically contains information about the token's format and the encryption algorithm used to secure it. The payload contains information about the token's subject (i.e., the user) and any associated metadata. The signature is used to verify the integrity of the token and ensure that it has not been tampered with.

Using a JWT access token has several advantages, including increased security, compactness, and the ability to include arbitrary metadata in the payload. However, it also requires additional processing to verify the signature and extract the relevant information from the token.

## Token Introspection

To validate an access token and determine its details (such as the expiration time and associated scopes), the client or resource server may need to query the authorization server using the Token Introspection endpoint. The Token Introspection endpoint allows the client to submit a token and receive information about its validity and associated metadata.

The client sends a POST request to the Token Introspection endpoint with the following parameters:

- `token`: The access token that the client wants to validate.

The authorization server will then respond with information about the validity and metadata of the token, such as its expiration time and associated scopes.

The following is an example request to the Token Introspection endpoint:

```http
POST /introspect HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

## Token Revocation

If a user decides to revoke access to their resources or if a client suspects that an access token has been compromised, the client can use the Token Revocation endpoint to invalidate the token.

The client sends a POST request to the Token Revocation endpoint with the following parameters:

- `token`: Represents the access token that the client wants to revoke
- `token_type_hint`: Indicates the type of token being revoked (e.g., "access_token" or "refresh_token").

The following is an example request to the token revocation endpoint:

```http
POST /revoke HTTP/1.1
Host: server.example.com
Content-Type: application/x-www-form-urlencoded

token=<access_token>&token_type_hint=<token_type_hint>
```

## Protected Resource Server

The protected-resource server is responsible for handling read and update operations on user data for authenticated users. To ensure that only authorized users are able to access and modify user data, the protected-resource server validates the ownership of the requested resource using the sub claim in the access token.

The following is an example request to the protected-resource `/user/:id` endpoint:

```http
GET /users/123 HTTP/1.1
Host: protected-resource-server.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJpc3MiOiJodHRwczovL2F1dGguZXhhbXBsZS5jb20iLCJleHAiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Replace `<access_token>` with a valid access token obtained from the `authorization-server`. If the token is invalid or the user is not authorized to access the requested resource, the protected-resource server will respond with a `401 Unauthorized` error or a `403 Forbidden` error if the permission is explicitly denied.

To validate the `access_token` presented by a client, the `protected-resource` server will send a request to the `/introspect` endpoint provided by the `authorization-server`.

## Client App

This is a brief introduction to a client-side application that interacts with an OAuth2 ecosystem. The application's file structure is organized as follows:

### Client Folder structure

```sh
└── index.js
└── public/
    └── callback.html
    └── css/
        └── main.css
    └── index.html
    └── js/
        └── main.js
    └── profile.html
    └── register.html
```

- `index.js`: Serves as the entry point for your application and initializes necessary components and configuration for communicating with the OAuth2 ecosystem.
- `public/`: This folder holds all of your static assets for the client-side application to function.
- `callback.html`: Acts as the callback URL for the OAuth2 ecosystem to redirect the user after authentication. Your client-side application retrieves the access and refresh tokens using the information in the URL.
- `css/`: Folder contains stylesheets used to style the pages of your client-side application. main.css serves as the primary stylesheet.
- `index.html` serves as the main landing page of your client-side application and contains a login form for user authentication with the OAuth2 ecosystem.
- `js/`: Folder holds all of the necessary JavaScript files to add interactivity and functionality to your pages. `main.js` is the main file and contains the code that sets up the OAuth2 client and communicates with the OAuth2 ecosystem.
- `profile.html`: Is the page that the user is redirected to after successfully authenticating with the OAuth2 ecosystem. It will display the user's profile information.
- `register.html`: Is the page that the user can use to create a new account with the OAuth2 ecosystem.

## Conclusion

In conclusion, securing browser-based applications is critical to protect sensitive information from unauthorized access. The OAuth 2.0 authorization framework is a widely used industry standard for securing web applications. By implementing the OAuth2.1 authorization code flow with PKCE extension, we can add an additional layer of security to prevent malicious attacks by unauthorized clients. This document has provided a comprehensive guide on how to secure a JavaScript application using the OAuth2.1 authorization code flow with PKCE extension. We covered the architecture of a clean application oriented by domain, the steps involved in implementing the authorization code flow with PKCE extension, and best practices for securing browser-based apps.

## References

- RFC 6749 - OAuth 2.0 Authorization Framework
- RFC 6750 - OAuth 2.0 Authorization Framework: Bearer Token Usage
- RFC 7636 - Proof Key for Code Exchange by OAuth Public Clients
- RFC 7009 - OAuth 2.0 Token Revocation
- RFC 7662 - OAuth 2.0 Token Introspection
- RFC 6819 - OAuth 2.0 Threat Model and Security Considerations
- RFC 8414 - OAuth 2.0 Authorization Server Metadata
- RFC 9068 - JSON Web Token (JWT) Profile for OAuth 2.0 Access Tokens
- RFC 7519 - JSON Web Token (JWT)
- draft-ietf-oauth-browser-based-apps-13 - OAuth 2.0 for Browser-Based Apps

## Author

Francisco Gargiulo
