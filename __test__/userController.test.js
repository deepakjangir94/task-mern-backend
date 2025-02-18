const { registerUser } = require('../controllers/userController.js')
const userModel = require('../models/userModel.js')

jest.mock('../models/userModel', () => {
    const mockUser = {
        _id: 'user.id',
        name: 'My Name',
        email: 'myemail@gmail.com'
    };

    return {
        findOne: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(mockUser)
    }
});

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockResolvedValue('mock-token')
}));

const bcrypt = require('bcryptjs');

bcrypt.genSalt = jest.fn().mockResolvedValue('mock-salt');

bcrypt.hash = jest.fn().mockResolvedValue('mock-hashed-password');

test('should register a new user', async() => {
    const req = {
        body: {
            name: 'My Name',
            email: 'myemail@gmail.com',
            password: 'mypassword'
        },
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };

    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
})

test('should return a 400 error if any field is missing', async () => {
    const req = {
        body: {
            name: 'My name 2',
            email: '', // email is missing intentationally 
            password: 'My password 2'
        }
    }

    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    }

    await expect(registerUser(req, res)).rejects.toThrow('All fields are mandatory');
    expect(res.status).toHaveBeenCalledWith(400);
})