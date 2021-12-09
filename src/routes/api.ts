import { Router } from 'express';
import multer from 'multer';
import * as SongController from '../controllers/song.controller';
import * as UserController from '../controllers/user.controller';
import { privateRoute } from '../config/passport';

const upload = multer({
	dest: './tmp',
	fileFilter: (req, file, cb) => {
		const allowed: string[] = ['image/jpg', 'image/jpeg', 'image/png'];
		cb(null, allowed.includes( file.mimetype ));
	},
	limits: { fieldSize: 2000000 }
});
const router = Router();

router.get('/lyrics', privateRoute, SongController.all);
router.get('/lyric/:title', SongController.getOne);
router.put('/update', privateRoute, SongController.update);
router.delete('/delete/:id', privateRoute, SongController.remove);
router.delete('/deleteUser/:id', privateRoute, UserController.remove);
router.post('/add', privateRoute, upload.single('avatar'), SongController.insert);
router.post('/register', UserController.register);
router.post('/registerAdm', privateRoute, UserController.registerAdm);
router.post('/login', UserController.login);
router.get('/my-account', privateRoute, UserController.my_account);//Privad, so para eu poder saber quem esta logado
router.get('/users', privateRoute, UserController.getUserList);
router.get('/user/:id', privateRoute, UserController.getOneUser);
router.put('/updateUser', privateRoute, UserController.updateUser);

export default router;