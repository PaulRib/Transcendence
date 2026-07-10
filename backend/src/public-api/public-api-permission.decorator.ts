import { SetMetadata } from "@nestjs/common"; 

export const PUBLIC_API_PERMISSION_KEY = "publicApiPermission";
export type PublicApiPermissionType = "read" | "write";

export const PublicApiPermission = (permission: PublicApiPermissionType) =>
	SetMetadata(PUBLIC_API_PERMISSION_KEY, permission);