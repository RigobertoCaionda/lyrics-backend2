import { unlink } from 'fs/promises';
import { Request, Response } from 'express';
import { Song } from '../models/Song';
import sharp from 'sharp';//Manipular arquivos
import dotenv from 'dotenv';

dotenv.config();


export const all = async (req: Request, res: Response) => {
	const list = await Song.findAll();
	for (let i in list) {
		list[i].image = `${process.env.BASE_URL}${list[i].image}`;
	}
	res.json({ list, userData: req.user });
}

export const getOne = async (req: Request, res: Response) => {
	let title: string = req.params.title;
	let song = await Song.findOne({where: {title}});
	if (song) {
		song.image = `${process.env.BASE_URL}${song.image}`;
		res.json({data: song});
	} else {
		res.json({data: {error: 'letra nao achada!'}});//Vc tmbm retorna data, so que dentro de data vc retorna um objeto de erro
	}
}
export const insert = async (req: Request, res: Response) => {
	let { title, body, singer } = req.body;
	let filename: string = ''; 
	if (title && body && singer) {
		if (req.file !== undefined) {
			filename = `${req.file.filename}.jpg`;
			await sharp(req.file.path)
			.resize(150, 150, {
				fit: sharp.fit.cover
			})
			.toFormat('jpeg')
			.toFile(`./public/media/${filename}`);
			await unlink(req.file.path);
		}
		let newLyric = await Song.create({
			title,
			body,
			singer,
			image: filename
		});
		res.status(201).json({data: newLyric});
	} else {
		res.json({data: {error: 'Preencha os campos obrigatorio!'}})
	}
}

export const update = async (req: Request, res: Response) => {
	let { id, title, body, singer } = req.body;
	let lyrics = await Song.findByPk(id);
	if (lyrics) {
		if (title) {
			lyrics.title = title;
		}
		if (body) {
			lyrics.body = body;
		}
		if (singer) {
			lyrics.singer = singer;
		}
		await lyrics.save();
		res.json({data: lyrics});
	} else {
		res.json({data: {error: 'Essa Letra nao existe!'}});
	}
}

export const remove = async (req: Request, res: Response) => {
	let id: string = req.params.id;
	let lyrics = await Song.findByPk(id);
	if (lyrics) {
		await lyrics.destroy();
		if (lyrics.image) {
			await unlink(`./public/media/${lyrics.image}`);
		}
	}
	res.json({});
}