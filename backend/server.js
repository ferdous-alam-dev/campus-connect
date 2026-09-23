require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

let db;

// ================================
// TEST ROUTE
// ================================
app.get("/", (req, res) => {
  res.json({
    message: "CampusConnect Backend is running 🚀",
  });
});

// ================================
// SIGN UP API
// ================================
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Users collection
    const users = db.collection("users");

    // Check existing email
    const existingUser = await users.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      createdAt: new Date(),
    };

    // Save user
    const result = await users.insertOne(newUser);

    res.status(201).json({
      message: "Account created successfully 🎉",
      userId: result.insertedId,
    });
  } catch (error) {
    console.error("Signup error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// ================================
// LOGIN API
// ================================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const users = db.collection("users");

    const user = await users.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    res.status(200).json({
      message: "Login successful 🎉",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Login error:", error.message);

    res.status(500).json({
      message: "Server error",
    });
  }
});
// ================================
// JOIN COMMUNITY API
// ================================
app.post("/api/community/join", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const users = db.collection("users");

    const user = await users.findOne({
      _id: new (require("mongodb").ObjectId)(userId),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          communityMember: true,
          communityJoinedAt: new Date(),
        },
      }
    );

    res.status(200).json({
      message: "Welcome to the CampusConnect Community! 🎓",
    });
  } catch (error) {
    console.error("Community join error:", error.message);

    res.status(500).json({
      message: "Could not join community",
    });
  }
});
// ================================
// COMMUNITY POSTS API
// ================================

// CREATE POST
app.post("/api/community/posts", async (req, res) => {
  try {
    const { userId, text } = req.body;

    if (!userId || !text) {
      return res.status(400).json({
        message: "User ID and post text are required",
      });
    }

    const users = db.collection("users");

    const user = await users.findOne({
      _id: new (require("mongodb").ObjectId)(userId),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = db.collection("communityPosts");

    const newPost = {
      userId: user._id,
      name: user.name,
      text: text.trim(),
      likes: 0,
      createdAt: new Date(),
    };

    const result = await posts.insertOne(newPost);

    res.status(201).json({
      message: "Post created successfully 🎉",
      post: {
        id: result.insertedId,
        name: newPost.name,
        text: newPost.text,
        likes: newPost.likes,
      },
    });
  } catch (error) {
    console.error("Create post error:", error.message);

    res.status(500).json({
      message: "Could not create post",
    });
  }
});

// GET ALL POSTS
app.get("/api/community/posts", async (req, res) => {
  try {
    const posts = db.collection("communityPosts");

    const allPosts = await posts
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(allPosts);
  } catch (error) {
    console.error("Get posts error:", error.message);

    res.status(500).json({
      message: "Could not load posts",
    });
  }
});
// ================================
// LIKE COMMUNITY POST
// ================================

app.post("/api/community/posts/:id/like", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");

    const posts = db.collection("communityPosts");

    const result = await posts.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $inc: { likes: 1 } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const updatedPost = await posts.findOne({
      _id: new ObjectId(req.params.id),
    });

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Like post error:", error.message);

    res.status(500).json({
      message: "Could not like post",
    });
  }
});
// ================================
// ADD COMMENT TO COMMUNITY POST
// ================================

app.post("/api/community/posts/:id/comment", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const { userId, text } = req.body;

    if (!userId || !text || !text.trim()) {
      return res.status(400).json({
        message: "User ID and comment text are required",
      });
    }

    const users = db.collection("users");

    const user = await users.findOne({
      _id: new ObjectId(userId),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const posts = db.collection("communityPosts");

    const post = await posts.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const comment = {
      id: new ObjectId(),
      userId: user._id,
      name: user.name,
      text: text.trim(),
      createdAt: new Date(),
    };

    await posts.updateOne(
      { _id: post._id },
      { $push: { comments: comment } }
    );

    res.status(201).json({
      message: "Comment added successfully 💬",
      comment,
    });
  } catch (error) {
    console.error("Comment error:", error.message);

    res.status(500).json({
      message: "Could not add comment",
    });
  }
});
// ================================
// DELETE COMMUNITY POST
// ================================

app.delete("/api/community/posts/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const posts = db.collection("communityPosts");

    const post = await posts.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only delete your own post.",
      });
    }

    await posts.deleteOne({
      _id: post._id,
    });

    res.status(200).json({
      message: "Post deleted successfully 🗑️",
    });
  } catch (error) {
    console.error("Delete post error:", error.message);

    res.status(500).json({
      message: "Could not delete post",
    });
  }
});
// ================================
// EDIT COMMUNITY POST
// ================================

app.put("/api/community/posts/:id", async (req, res) => {
  try {
    const { ObjectId } = require("mongodb");
    const { userId, text } = req.body;

    if (!userId || !text || !text.trim()) {
      return res.status(400).json({
        message: "User ID and post text are required",
      });
    }

    const posts = db.collection("communityPosts");

    const post = await posts.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.userId.toString() !== userId) {
      return res.status(403).json({
        message: "You can only edit your own post.",
      });
    }

    await posts.updateOne(
      { _id: post._id },
      {
        $set: {
          text: text.trim(),
          updatedAt: new Date(),
        },
      }
    );

    const updatedPost = await posts.findOne({
      _id: post._id,
    });

    res.status(200).json({
      message: "Post updated successfully ✏️",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Edit post error:", error.message);

    res.status(500).json({
      message: "Could not edit post",
    });
  }
});
// ================================
// START SERVER
// ================================
async function startServer() {
  try {
    const client = new MongoClient(MONGODB_URI);

    await client.connect();

    console.log("✅ MongoDB connected successfully!");

    db = client.db("campusconnect");

    app.listen(PORT, () => {
      console.log(
        `🚀 Backend server running at http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:");
    console.error(error.message);
  }
}

startServer();