import { NotFoundError } from "../errors/AppError";
import User from "../models/User";


export async function getDeletedUser(id: string) {

    const user = await User.findById(id);

    if (user?.deletedAt === null) {
        throw new NotFoundError("Deleted user not found");
    }


}

export async function getAdminUsers() {


    const users = await User.find({
        deletedAt: null,
    });

    return users;
}