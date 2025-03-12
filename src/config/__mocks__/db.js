// src/config/__mocks__/db.js
module.exports = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  post: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};
