import User from '../database/models/userModel'

export const getUserByEmail = async (email: string) =>
  User.findOne({ where: { email } })

export const getUserById = async (id: number) => {
  const user = await User.findOne({ where: { id } })
  return user
}

export const getUserByUsername = async (username: string) =>
  User.findAll({ where: { username } })

export const createUser = async (details: object) => User.create(details)

export const getUserByRole = (userRole: string) =>
  User.findAll({ where: { userRole } })

export const deleteUserById = (id: string) => User.destroy({ where: { id } })
