import userModel from "../models/userModel";

class UserService {
  async getUsers() {
    return await userModel.findAll();
  }

  async getUserByUsername(username: string) {
    return await userModel.findByUsername(username);
  }
}

export default UserService;
  