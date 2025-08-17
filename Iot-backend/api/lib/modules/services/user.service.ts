import UserModel  from "../schemas/user.schema";
import { IUser } from "../models/user.model";

class UserService {
    public async createNewOrUpdate(user: IUser) {
        try {
            if (!user._id) {
                const dataModel = new UserModel(user);
                return await dataModel.save();
            } else {
                return await UserModel.findByIdAndUpdate(user._id, { $set: user }, { new: true });
            }
        } catch (error) {
            console.error('Error creating data:', error);
            throw new Error('Error creating data');
        }
    }

    public async getByEmailOrName(name:string) {
        try {
            const result = await UserModel.findOne({ $or: [{ email: name }, { name: name }] });
            if (result) {
                return result;
            }
        }catch (error) {
            console.error('Error downloading data:', error);
            throw new Error('Error downloading data');
        }
    }
}
export default UserService;