const router = require('express').Router();
const { body } = require('express-validator');
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', getTasks);
router.get('/:id', getTask);

router.post(
  '/',
  [body('title').trim().notEmpty().withMessage('Title is required')],
  createTask
);

router.put(
  '/:id',
  [body('title').optional().trim().notEmpty().withMessage('Title cannot be empty')],
  updateTask
);

router.delete('/:id', deleteTask);

module.exports = router;
