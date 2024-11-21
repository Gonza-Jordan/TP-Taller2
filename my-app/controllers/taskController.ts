// controllers/taskController.ts
import Task from '../models/task';
import express from 'express';


export const getTasks = async (req: express.Request, res: express.Response) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks', error });
  }
};

export const createTask = async (req: express.Request, res: express.Response) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    console.log("task created");
    res.status(201).json({message: 'Task created successfully.', task: savedTask});
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

export const updateTask = async (req: express.Request, res: express.Response) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params['id'], req.body, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json(updatedTask);
    
  } catch (error) {
    return res.status(500).json({ message: 'Error updating task', error });
  }
};

export const deleteTask = async (req: express.Request, res: express.Response) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params['id']);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting task', error });
  }
};