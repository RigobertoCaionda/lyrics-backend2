import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
   'postgres://hhlxcocjjqpuor:92b2b8be5a2aa67996ec093683846d17d626fc421fae5a8f36f4168359b0e2a1@ec2-44-193-111-218.compute-1.amazonaws.com:5432/d46fb0hfhv9icg',
   {
      dialectOptions: {
         ssl: {
            require: true,
            rejectUnauthorized: false,
         },
      },
   }
);

sequelize.sync();
