import express, { Request, Response, ErrorRequestHandler } from 'express';
import { resolve } from 'path';//Quase a mesma funcao que o path
import { MulterError } from 'multer';
import dotenv from 'dotenv';
import cors from 'cors';
import apiRoutes from './routes/api';

dotenv.config();

const server = express();

server.use(cors({
	origin: '*',
	methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
server.use('/file', express.static(resolve(__dirname, '../public/media')));//Disponibilizando o acesso aos arquivos na pasta publica
server.use(express.urlencoded({extended: true}));
server.use(express.json());//Para poder receber os dados que vem do corpo da requisicao. usa-se em post, put

server.use(apiRoutes);

server.use((req: Request, res: Response)=>{
	res.status(404);
	res.json({error: 'Endpoint não encontrado!'});
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {//Nao precisa tipar por causa do ErrorRequestHandler
	if (err.data.status) {
		res.status(err.data.status);
	} else {
		res.status(400);//Bad request
	}

	if (err.data.message) {
		res.json({ data: { error: err.data.message } });
	} else {
		res.json({ data: { error: 'Ocorreu algum erro!' } });
	}

	if (err instanceof MulterError) {//Se o erro for do multer
		res.json({ data: { error: err.code } });
	} else {
		res.json({ data: { error: 'Ocorreu algum erro!' } });
	}

}
server.use(errorHandler);//Rota para lidar com erros

server.listen(process.env.PORT);