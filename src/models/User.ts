import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/postgres';

export interface UserInstance extends Model {
   id_user: string;
   name: string;
   lastName: string;
   email: string;
   password: string;
   accessLevel: string;
}

export const User = sequelize.define<UserInstance>(
   'User',
   {
      id_user: {
         primaryKey: true,
         autoIncrement: true,
         type: DataTypes.INTEGER,
      },
      name: {
         type: DataTypes.STRING,
      },
      lastName: {
         type: DataTypes.STRING,
      },
      email: {
         type: DataTypes.STRING,
      },
      password: {
         type: DataTypes.STRING,
      },
      accessLevel: {
         type: DataTypes.STRING,
      },
   },
   {
      tableName: 'users',
      timestamps: false,
   }
);
