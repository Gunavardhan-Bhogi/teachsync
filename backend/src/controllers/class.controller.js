import Class from '../models/Class.js';

// @desc    Create a new class
// @route   POST /api/classes
export const createClass = async (req, res) => {
  try {
    const { className, subject, students } = req.body;

    if (!className || !subject) {
      return res.status(400).json({ error: 'className and subject are required fields.' });
    }

    const newClass = new Class({
      className,
      subject,
      students: students || [],
    });

    const savedClass = await newClass.save();
    return res.status(201).json(savedClass);
  } catch (error) {
    console.error('Error creating class:', error);
    return res.status(500).json({ error: error.message || 'Server error creating class.' });
  }
};

// @desc    Get all classes
// @route   GET /api/classes
export const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    return res.status(200).json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return res.status(500).json({ error: error.message || 'Server error fetching classes.' });
  }
};

// @desc    Get single class by ID
// @route   GET /api/classes/:id
export const getClassById = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({ error: 'Class not found' });
    }
    return res.status(200).json(classData);
  } catch (error) {
    console.error('Error fetching class details:', error);
    return res.status(500).json({ error: error.message || 'Server error fetching class.' });
  }
};
