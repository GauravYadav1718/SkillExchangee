const express = require('express');
const { body, validationResult } = require('express-validator');
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { search, category, level, sort } = req.query;
    let query = { isActive: true };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    if (level) {
      query.level = level;
    }

    let sortOptions = { createdAt: -1 }; 
    if (sort === 'alphabetical') {
      sortOptions = { title: 1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    }

    const skills = await Skill.find(query)
      .populate('user', 'name email')
      .sort(sortOptions);

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



router.get('/my-skills', auth, async (req, res) => {
  try {
    const skills = await Skill.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/', [auth, [
  body('title').trim().isLength({ min: 2 }),
  body('description').trim().isLength({ min: 10 }),
  body('category').isIn([ 'Frontend', 'UI/UX Design', 'AI/ML', 'Backend', 'Cybersecurity', 'Java', 'DSA', 'Other'])
]], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, level } = req.body;

    const skill = new Skill({
      title,
      description,
      category,
      level,
      user: req.user._id
    });

    await skill.save();
    await skill.populate('user', 'name email');

    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { title, description, category, level } = req.body;
    
    skill.title = title || skill.title;
    skill.description = description || skill.description;
    skill.category = category || skill.category;
    skill.level = level || skill.level;

    await skill.save();
    await skill.populate('user', 'name email');

    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }

    if (skill.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await skill.deleteOne();
    res.json({ message: 'Skill deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
