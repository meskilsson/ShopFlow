


export interface DeleteAdminUserByIdInput {
    targetUserId: string;
    adminUserId: string;
    deleteReason?: string | undefined;
}

export interface RestoreAdminUserByIdInput {
    targetUserId: string;
}

