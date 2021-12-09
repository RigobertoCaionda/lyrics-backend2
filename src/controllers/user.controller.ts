import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateToken } from '../config/passport';

export const getUserList = async (req: Request, res: Response) => {
	const list = await User.findAll();
	if (list) {
		res.json({ data: { list } });
	} else {
		res.json({ data: { error: 'Algo deu errado!' } });
	}
}

export const register = async (req: Request, res: Response) => {
	if (req.body.name && req.body.lastName && req.body.email && 
		req.body.password && req.body.confirmPassword && req.body.accessLevel) {
		let { name, lastName, email, password, confirmPassword, accessLevel } = req.body;
		if (accessLevel !== 'usuario') {//Aqui so se deve cadastrar usuarios
			res.json({ data: { error: 'Só administradores podem cadastrar outros administradores!' } });
		} else {
				let hasUser = await User.findOne({where: { email }});
				if (!hasUser) {
					if (password === confirmPassword) {
						let newUser = await User.create({ name, lastName, email, password, confirmPassword, 
						accessLevel });
						const token = generateToken({ id: newUser.id_user });
						res.status(201);
						res.json({ id: newUser.id_user, fullName: `${newUser.name} ${newUser.lastName}`, token });
					} else {
						res.json({ data: { error: 'Senhas não batem!' } });
					}
				} else {
					res.json({ data: { error: 'Email já existe!' } });
				}
		}
	} else {
		res.json({ data: { error: 'Precisa enviar todos os dados necessários!' } });
	}
}

export const registerAdm = async (req: Request, res: Response) => {
	if (req.body.name && req.body.lastName && req.body.email && 
		req.body.password && req.body.confirmPassword && req.body.accessLevel) {
		let { name, lastName, email, password, confirmPassword, accessLevel } = req.body;
				let hasUser = await User.findOne({where: { email }});
				if (!hasUser) {
					if (password === confirmPassword) {
						let newUser = await User.create({ name, lastName, email, password, confirmPassword, 
						accessLevel });
						const token = generateToken({ id: newUser.id_user });
						res.status(201);
						res.json({ id: newUser.id_user, token });
					} else {
						res.json({ data: { error: 'Senhas não batem!' } });
					}
				} else {
					res.json({ data: { error: 'Email já existe!' } });
				}
	} else {
		res.json({ data: { error: 'Precisa enviar todos os dados necessários!' } });
	}
}

export const login = async (req: Request, res: Response) => {
	if (req.body.email && req.body.password) {
		let { email, password } = req.body;
		let user = await User.findOne({where: { email, password }});
		if (user) {
			const token = generateToken({ id: user.id_user });
			res.json({ data: { status: true, fullName: `${user.name} ${user.lastName}`, token } });
			return;
		}
	}
	res.json({ data: { status: false, error: 'Email e/ou senha errado!' } });
}
export const my_account = (req: Request, res: Response) => {
	if (req.user) {
		res.json({ data: { userData: req.user } });
	} else {
		res.json({ data: { error: 'Usuário não logado!' } });
	}
}

export const remove = async (req: Request, res: Response) => {
	let id: string = req.params.id;
	let user = await User.findByPk(id);
	if (user) {
		await user.destroy();
	}
	res.json({});
}

export const getOneUser = async (req: Request, res: Response) => {
	let id: string = req.params.id;
	let user = await User.findByPk(id);
	if (user) {
		res.json({ data: user, userData: req.user });
	} else {
		res.json({data: {error: 'Usuário não encontrado!'}});
	}
}

export const updateUser = async (req: Request, res: Response) => {
	let { id, name, lastName, email, password, accessLevel } = req.body;
	let user = await User.findByPk(id);
	if (user) {
		if (name) {
			user.name = name;
		}
		if (lastName) {
			user.lastName = lastName;
		}
		if (email) {
			user.email = email;
		}
		if (password) {
			user.password = password;
		}
		if (accessLevel) {
			user.accessLevel = accessLevel;
		}
		await user.save();
		res.json({data: user});
	} else {
		res.json({data: {error: 'Esse usuario nao existe!'}});
	}
}