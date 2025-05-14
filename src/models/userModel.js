/**
 * Author: LÊ TRỌNG TÌNH, SUBO
 * Created: YYYY-MM-DD
 * Description: Brief description of the file or function.
 */
import { GET_DB } from "~/config/mongodb";
import { ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import ApiError from "~/utils/ApiError";
import { StatusCodes } from "http-status-codes";

const COLLECTION_NAME = "users";

class UserModel {
  constructor({
    _id,
    email,
    password,
    fullName,
    avatarImg = "https://www.gravatar.com/avatar/?d=mp",
    birthDay,
    role = "USER",
  }) {
    this._id = _id ? ObjectId.createFromHexString(_id) : null;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.avatarImg = avatarImg;
    this.birthDay = birthDay;
    this.role = role;
  }

  static async findByEmail(email) {
    return await GET_DB().collection(COLLECTION_NAME).findOne({ email });
  }

  static async findById(id) {
    if (!ObjectId.isValid(id)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid ObjectId");
    }
    return await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id),
      });
  }

  static async findByEmailOrFullName(searchTerm) {
    if (searchTerm === "" || searchTerm === " ") return;

    try {
      return await GET_DB()
        .collection(COLLECTION_NAME)
        .find({
          $or: [
            { email: { $regex: searchTerm, $options: "i" } }, // Tìm email gần đúng (không phân biệt hoa thường)
            { fullName: { $regex: searchTerm, $options: "i" } }, // Tìm tên đầy đủ gần đúng (không phân biệt hoa thường)
          ],
        })
        .toArray();
    } catch (error) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Error while searching user");
    }
  }

  static async findParticipants(participants) {
    return await GET_DB()
      .collection(COLLECTION_NAME)
      .find({ _id: { $in: participants } })
      .project({ fullName: 1, avatar: 1 })
      .toArray();
  }

  static async findAdminInConversation(id) {
    return await GET_DB()
      .collection(COLLECTION_NAME)
      .findOne({ _id: id }, { projection: { fullName: 1, avatar: 1 } });
  }

  static async createUser(user) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    const newUser = { ...user, password: hashedPassword };
    const result = await GET_DB()
      .collection(COLLECTION_NAME)
      .insertOne(newUser);
    return result.insertedId;
  }

  static async updatePassword(id, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await GET_DB()
      .collection(COLLECTION_NAME)
      .updateOne(
        { _id: ObjectId.createFromHexString(id) },
        { $set: { password: hashedPassword } }
      );
  }

  static async deleteUser(id) {
    await GET_DB()
      .collection(COLLECTION_NAME)
      .deleteOne({
        _id: ObjectId.createFromHexString(id),
      });
  }
}

export default UserModel;
