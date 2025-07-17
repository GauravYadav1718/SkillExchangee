const express = require('express');
const { body, validationResult } = require('express-validator');
const Request = require('../models/Request');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/', auth, async (req, res) => {
  try {
    const sent = await Request.find({ from: req.user._id })
      .populate('to', 'name email')
      .populate('skill', 'title description')
      .sort({ createdAt: -1 });

    const received = await Request.find({ to: req.user._id })
      .populate('from', 'name email')
      .populate('skill', 'title description')
      .sort({ createdAt: -1 });

    res.json({ sent, received });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', [auth, [
  body('to').isMongoId(),
  body('skill').isMongoId(),
  body('message').trim().isLength({ min: 1, max: 500 }).optional()
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { to, skill, message } = req.body;

    const existingRequest = await Request.findOne({
      from: req.user._id,
      to,
      skill
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already sent' });
    }

    const request = new Request({
      from: req.user._id,
      to,
      skill,
      message
    });

    await request.save();
    await request.populate('to', 'name email');
    await request.populate('skill', 'title description');

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { status } = req.body;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    request.status = status;
    await request.save();
    await request.populate('from', 'name email');
    await request.populate('skill', 'title description');

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/accepted-users', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    const acceptedRequests = await Request.find({
      $or: [
        { sender: userId },
        { receiver: userId }
      ],
      status: 'Accepted'
    }).populate('sender receiver', 'name email');

    const acceptedUsers = acceptedRequests.map(req =>
      req.sender._id.toString() === userId.toString() ? req.receiver : req.sender
    );

    res.json({ requests: acceptedUsers });
  } catch (error) {
    console.error('Error fetching accepted users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
