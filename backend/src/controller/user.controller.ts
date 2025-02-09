

import { Request, Response } from 'express';
import User from '../models/User';






export const createUser = async (req: Request, res: Response) => {
  try {
    const newData = await User.create(req.body);
    res.status(201).json(newData);
  } catch (error) {
    console.error('Erro ao criar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id);
    if (!data) 
       res.status(404).json({ message: ' não encontrado' });
    res.status(200).json(data);
  } catch (error) {
    console.error('Erro ao buscar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
     const userId = req.params.userId;
     const updates = req.body;
    const updatedData = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });
    if (!updatedData) 
       res.status(404).json({ message: 'Usuário não encontrado' });
    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Erro ao atualizar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId= req.params;
    const deletedData = await User.findByIdAndDelete(userId);
    if (!deletedData) 
       res.status(404).json({ message: ' não encontrado' });
    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar :', error);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
};