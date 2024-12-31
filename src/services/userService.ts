import userModel from "../models/userModel";

class UserService {
  async getUsers() {
    return await userModel.findAll();
  }
}

export default UserService; 