# TCTF Open API Specification
 A sample TCTF api built on OAS(Open-api Specification 3.0) using the API-design first approach


## multi-spec-openapi

> Swagger UI powered by Vite with built-in support for multiple APIs.

## What this is

It's hard to beat Swagger UI when looking for a free way to visualize and interact with your OpenAPI APIs.

It is not trivial, though, to deploy Swagger UI or configure it to support multiple APIs.

This project changes that and pre-configures Vite and Swagger UI for you. Just bring your spec files and run.

## How to use it

1. Clone this repo

```bash
git clone https://github.com/cometbid-sfi/csf-portal-api.git
```

2. Install dependencies

```bash
cd csf-portal-api
npm install
```

3. Configure the `urls` array in `src/main.ts` to point to your JSON and/or YAML API spec files. Two examples are included that reference specs in the `public/specs/` directory.

4. Deploy and view as you would any other Vite project. Toggle between APIs using the dropdown at the top right of the page.

```bash
# Run development server
npm run dev

# Or build for production and preview
npm run build
npm run preview
```

# How to host Swagger API documentation with GitHub Pages

This repository is a template for using the [Swagger UI](https://github.com/swagger-api/swagger-ui) to dynamically generate beautiful documentation for your API and host it for free with GitHub Pages.

The template will periodically auto-update the Swagger UI dependency and create a pull request. See the [GitHub Actions workflow here](.github/workflows/update-swagger.yml).

The example API specification used by this repository can be seen hosted at [https://cometbid-sfi.github.io/openapi-ecommerce-ui.github.io/](https://cometbid-sfi.github.io/openapi-ecommerce-ui.github.io/).
