const router = require('express').Router();
const { Post, Comment, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    const formattedPosts = postData.map(post => ({
      ...post.get({ plain: true }),
      created_at: post.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      updated_at: post.updatedAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));
   

    res.render('homepage', { 
      posts: formattedPosts, 
      logged_in: req.session.logged_in
      
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['name'],
        },
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    const post = postData.get({ plain: true });

    res.render('post', {
      ...post,
      postID: post.id,
      created_at: post.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      logged_in: req.session.logged_in,
      url: req.originalUrl
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/post/:id/comment', async (req, res) => {
  try {
    if (!req.session.logged_in) {
      return res.status(401).json({ message: 'You need to be logged in to comment.' });
    }

    const newComment = await Comment.create({
      content: req.body.content,
      user_id: req.session.user_id, 
      post_id: req.params.id, 
    });

    const user = await User.findByPk(req.session.user_id, {
      attributes: ['name'],
    });

    res.status(200).json({
      content: newComment.content,
      user: {
        name: user.name,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


router.get('/dashboard', withAuth, async (req, res) => {
  
  try {
    const userId = req.session.user_id;

    const posts = await Post.findAll({
      where: {
        user_id: userId, 
      },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });
    console.log(posts);
    const formattedPosts = posts.map(post => ({
      ...post.get({ plain: true }),
      createdAt: post.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));

    res.render('dashboard', { 
      posts: formattedPosts,
      logged_in: req.session.logged_in, 
      user: req.session.user 
     });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup');
});


router.post('/signup', async (req, res) => {
  try {
    const userData = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.loggedIn = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
