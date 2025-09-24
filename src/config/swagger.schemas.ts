/**
 * OpenAPI reusable schemas for Provolo API
 */

export const SwaggerSchemas = {
  User: {
    type: "object",
    properties: {
      id: { type: "string" },
      userId: { type: "string" },
      email: { type: "string" },
      displayName: { type: "string" },
      tierId: { type: "string" },
      subscribed: { type: "boolean" },
      createdAt: { type: "string" },
      updatedAt: { type: "string" },
    },
    required: ["id", "userId", "email", "tierId", "subscribed", "createdAt", "updatedAt"],
  },
  ApiResponse: {
    type: "object",
    properties: {
      title: { type: "string" },
      message: { type: "string" },
      status: { type: "string", enum: ["success", "error"] },
      data: {
        oneOf: [
          { $ref: "#/components/schemas/User" },
          { type: "null" },
          { type: "object" },
          { type: "array" },
        ],
      },
    },
    required: ["title", "message", "status", "data"],
  },
  ErrorResponse: {
    type: "object",
    properties: {
      title: { type: "string" },
      message: { type: "string" },
      status: { type: "string", enum: ["error"] },
      data: { type: "null" },
    },
    required: ["title", "message", "status", "data"],
  },
};
