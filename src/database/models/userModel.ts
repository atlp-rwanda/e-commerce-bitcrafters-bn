import { DataTypes, Model } from 'sequelize'
import sequelizeConnection from '../config/db.config'
import UserProfile from '../models/userProfile'

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer',
  SELLER = 'seller',
}

/**
 * User Interface
 */
export interface UserAttributes {
  id?: number
  username?: string
  email?: string
  password?: string
  userRole?: string
}

/**
 * Represents a user in the databases.
 */
class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number

  public username!: string

  public email!: string

  public password!: string

  public userRole!: string

  public static associate() {
    User.hasOne(UserProfile, {
      foreignKey: 'userId',
    });
  }}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userRole: {
      type: DataTypes.ENUM('admin', 'seller', 'buyer'),
      defaultValue: 'buyer',
    },
  },
  {
    sequelize: sequelizeConnection,
    modelName: 'User',
    tableName: 'Users',
    timestamps: true,
  },
)

export default User
