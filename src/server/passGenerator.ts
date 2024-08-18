import { generate, verify } from 'password-hash'
import { UsersController } from '../shared/Controllers/UsersController';
UsersController.generate = (what: string) => generate(what);
UsersController.verify =(pass,hash)=> verify(pass,hash)