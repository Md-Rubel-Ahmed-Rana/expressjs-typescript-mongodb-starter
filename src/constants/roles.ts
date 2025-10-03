export const ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
  MANAGER: "manager",
};

export type IRoles = (typeof ROLES)[keyof typeof ROLES];
