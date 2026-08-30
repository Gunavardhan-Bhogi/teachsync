import Lecture from '../models/Lecture.js';
import Class from '../models/Class.js';
import { transcribeAudio } from '../services/transcription.service.js';
import { generateLectureAnalysis } from '../services/gemini.service.js';
import { sendLectureEmails } from '../services/email.service.js';

// @desc   Upload audio & generate lecture draft with Whisper + Gemini
// @route  POST /api/lectures/generate-draft
export const generateDraft = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required.' });
    }

    const { classId, topic, formats: formatsString, totalQuestions } = req.body;
    
    if (!classId) {
      return res.status(400).json({ error: 'classId is required.' });
    }

    // Verify class exists
    const classExists = await Class.findById(classId);
    if (!classExists) {
      return res.status(404).json({ error: 'Class not found.' });
    }

    // Parse question formats
    let formats = ['mcq'];
    if (formatsString) {
      try {
        formats = typeof formatsString === 'string' ? JSON.parse(formatsString) : formatsString;
      } catch (e) {
        formats = [formatsString];
      }
    }

    const questionsCount = parseInt(totalQuestions, 10) || 5;

    // 1. Get the exact text transcript from OpenAI Whisper
    const rawTranscript = await transcribeAudio(req.file.buffer, req.file.mimetype);

    // 2. Feed the transcript TEXT to Gemini to generate the summary and quizzes
    const aiAnalysis = await generateLectureAnalysis(
      rawTranscript, 
      formats,
      questionsCount
    );

    const lectureTopic = topic || aiAnalysis.topic || 'Lecture Summary';

    // 3. Save initial draft in MongoDB
    const lectureDraft = new Lecture({
      classId,
      topic: lectureTopic,
      transcript: rawTranscript,
      audioSource: req.file.originalname || 'Uploaded Audio',
      summary: aiAnalysis.summary || { keyTakeaways: [], detailedNotes: '' },
      assessment: aiAnalysis.assessment || [],
      status: 'draft',
    });

    const savedDraft = await lectureDraft.save();

    return res.status(201).json({
      success: true,
      message: 'Lecture draft generated successfully',
      lectureId: savedDraft._id,
      topic: aiAnalysis.topic,
      transcript: rawTranscript,
      summary: aiAnalysis.summary,
      assessment: aiAnalysis.assessment
    });
  } catch (error) {
    console.error('Error generating lecture draft:', error);
    next(error); 
  }
};

// @desc   Update and dispatch lecture notes & quiz to students via email
// @route  POST /api/lectures/dispatch
export const dispatchLecture = async (req, res) => {
  try {
    const { lectureId, summary, assessment, topic, transcript } = req.body;

    if (!lectureId) {
      return res.status(400).json({ error: 'lectureId is required.' });
    }

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found.' });
    }

    if (topic) lecture.topic = topic;
    if (transcript !== undefined) lecture.transcript = transcript;
    if (summary) lecture.summary = summary;
    if (assessment) lecture.assessment = assessment;
    lecture.status = 'dispatched';

    const updatedLecture = await lecture.save();

    const classData = await Class.findById(lecture.classId);
    if (!classData) {
      return res.status(404).json({ error: 'Associated class not found.' });
    }

    let emailResult = null;
    try {
      emailResult = await sendLectureEmails(classData, updatedLecture);
    } catch (emailErr) {
      console.error('Failed sending lecture emails:', emailErr);
      return res.status(200).json({
        message: 'Lecture saved as dispatched, but email sending encountered an issue.',
        emailError: emailErr.message,
        lecture: updatedLecture,
      });
    }

    return res.status(200).json({
      message: 'Lecture successfully dispatched and emailed to students!',
      emailResult,
      lecture: updatedLecture,
    });
  } catch (error) {
    console.error('Error dispatching lecture:', error);
    return res.status(500).json({ error: error.message || 'Server error dispatching lecture.' });
  }
};

// @desc   Get all lectures
// @route  GET /api/lectures
export const getLectures = async (req, res) => {
  try {
    const { classId } = req.query;
    const query = classId ? { classId } : {};
    const lectures = await Lecture.find(query).populate('classId', 'className subject').sort({ createdAt: -1 });
    return res.status(200).json(lectures);
  } catch (error) {
    console.error('Error fetching lectures:', error);
    return res.status(500).json({ error: error.message || 'Server error fetching lectures.' });
  }
};

// @desc   Get single lecture by ID
// @route  GET /api/lectures/:id
export const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.id).populate('classId');
    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }
    return res.status(200).json(lecture);
  } catch (error) {
    console.error('Error fetching lecture:', error);
    return res.status(500).json({ error: error.message || 'Server error fetching lecture.' });
  }
};
