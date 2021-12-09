import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize(
   'postgres://ghroucorgycjhy:754eb908fe01eef51ccb8ad104586109f3221132dd7d7508c276add27bfae652@ec2-3-220-59-239.compute-1.amazonaws.com:5432/debnu1jatl1nh2',
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
