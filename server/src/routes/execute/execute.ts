import express, { Request, Response } from 'express';
import { frankenCommands, executeFunction } from '../../8sleep/deviceApi.js';

const router = express.Router();

router.post('/execute', async (req: Request, res: Response) => {
  const { command, arg } = req.body;

  // Basic validation
  if (!Object.keys(frankenCommands).includes(command)) {
    res.status(400).send('Invalid command');
    return;
  }

  // Execute the 8sleep command
  await executeFunction(command as keyof typeof frankenCommands, arg || 'empty');

  // Respond with success
  res.json({ success: true, message: `Command '${command}' executed successfully.` });
  return;
});

export default router;
