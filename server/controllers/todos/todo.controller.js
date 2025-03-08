import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({});

export const CreateTodoController = async (req, res) => {
  const { title, description, completed, priority } = req.body;
  try {
    const todo = await prisma.todo.create({
      data: {
        title,
        description,
        completed,
        priority,
        userId: req.user.id,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Todo created successfully",
      todo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating todo",
    });
  }
};

export const GetTodosByUserIdController = async (req, res) => {
  try {
    const todos = await prisma.todo.findMany({
      where: {
        userId: req.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 10,
    });
    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
    });
  }
};

export const GetTodoByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Todo fetched successfully",
      todo,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching todo",
    });
  }
};

export const UpdateTodoController = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed, priority } = req.body;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!todo) {
      return res.status(400).json({
        success: false,
        message: "Todo not found with id: " + id,
      });
    }
    const updatedTodo = await prisma.todo.update({
      where: {
        id: parseInt(id),
      },
      data: {
        title,
        description,
        completed,
        priority,
      },
    });
    return res.status(200).json({
      success: true,
      message: "Todo updated successfully",
      todo: updatedTodo,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while updating todo",
    });
  }
};

export const FindTodosByStatusController = async (req, res) => {
  const { completed } = req.body;
  try {
    const todos = await prisma.todo.findMany({
      where: {
        completed,
      },
      take: 10,
    });
    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {}
};

export const FindTodosByHighPriority = async (req, res) => {
  const { priority } = req.body;
  try {
    const todos = await prisma.todo.findMany({
      where: {
        priority: parseInt(priority) >= 5,
      },
      take: 10,
    });
    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
    });
  }
};

export const FindTodosByLowPriority = async (req, res) => {
  const { priority } = req.body;
  try {
    const todos = await prisma.todo.findMany({
      where: {
        priority: parseInt(priority) < 5,
      },
      take: 10,
    });
    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
    });
  }
};

export const FindTodosByTitleController = async (req, res) => {
  const { title } = req.body;
  try {
    const todos = await prisma.todo.findMany({
      where: {
        title: {
          contains: title,
        },
      },
      take: 10,
    });
    return res.status(200).json({
      success: true,
      message: "Todos fetched successfully",
      todos,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while fetching todos",
    });
  }
};

export const DeleteTodoController = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await prisma.todo.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found with id: " + id,
      });
    }
    await prisma.todo.delete({
      where: {
        id: parseInt(id),
      },
    });
    return res.status(200).json({
      success: true,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while deleting todo",
    });
  }
};