import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../instances/postgres';

export interface SongInstance extends Model {
   id: number;
   title: string;
   body: string;
   singer: string;
   image: string;
}

export const Song = sequelize.define<SongInstance>(
   'Song',
   {
      id: {
         primaryKey: true,
         autoIncrement: true,
         type: DataTypes.INTEGER,
      },
      title: {
         type: DataTypes.STRING,
      },
      body: {
         type: DataTypes.STRING,
      },
      singer: {
         type: DataTypes.STRING,
      },
      image: {
         type: DataTypes.STRING,
      },
   },
   {
      tableName: 'songs',
      timestamps: false,
   }
);
