// models/user.ts
import { DataTypes, Sequelize } from 'sequelize';
import sequelize from '../config/database';
import { timeStamp } from 'console';


const verificationToken = sequelize.define("verificationToken",{
  userId:{
    type:DataTypes.INTEGER,
    allowNull:false,
    onDelete: 'CASCADE',
    unique: true,
    references: {
      model: 'Person',
      key: 'id',
      
  }},
  token:{
    type:DataTypes.STRING,
    allowNull:false,
  }
},
{
  timestamps: true,
})
const Person = sequelize.define('Person', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  verified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue:"user",
  },
}, {
  timestamps: false,
});

export  {Person, verificationToken};
