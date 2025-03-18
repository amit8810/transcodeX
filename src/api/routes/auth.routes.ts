import { Router } from 'express';
import { UserRepository } from '../repositories/user.repository';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { createUserSchema, loginUserSchema, sessionDeleteSchema } from '../validators';
import { AuthMiddleware } from '../middlewares/auth.middleware';

const router = Router();
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.route('/register').post(validate(createUserSchema, ['body']), authController.registerUser.bind(authController));
router.route('/login').post(validate(loginUserSchema, ['body']), authController.login.bind(authController));

router
  .route('/sessions/:id')
  .delete(validate(sessionDeleteSchema, ['params']), authController.removeSession.bind(authController));

// Protected Routes
router.route('/profile').get(AuthMiddleware.verifyJwt, authController.getUserProfile.bind(authController));

export default router;
