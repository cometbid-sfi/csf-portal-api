import SwaggerUI from "swagger-ui";
import SwaggerUIStandalonePreset from "swagger-ui/dist/swagger-ui-standalone-preset";
import "swagger-ui/dist/swagger-ui.css";

SwaggerUI({
  urls: [
    { url: "./specs/authentication-api.yaml", name: "Authentication - API" },
    {
      url: "./specs/member-openapi.yaml",
      name: "Membership - API",
    },
  ],
  dom_id: "#app",
  deepLinking: true,
  presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset],
  layout: "StandaloneLayout",
});
