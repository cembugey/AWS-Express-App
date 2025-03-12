// tests/postController.test.js
const postController = require("../src/controllers/postController");
const prisma = require("../src/config/db");

jest.mock("../src/config/db");

describe("postController.getAllPosts", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it("should return all posts", async () => {
    // Prepare a fake posts array
    const fakePosts = [
      {
        id: 1,
        title: "Test Post",
        content: "Content",
        userId: 1,
        user: { id: 1, email: "user@example.com" },
      },
    ];
    prisma.post.findMany.mockResolvedValue(fakePosts);

    await postController.getAllPosts(req, res);
    expect(res.json).toHaveBeenCalledWith(fakePosts);
  });

  it("should return 500 if an error occurs", async () => {
    prisma.post.findMany.mockRejectedValue(new Error("DB Error"));

    await postController.getAllPosts(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
  });
});
