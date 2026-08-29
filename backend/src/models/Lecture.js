import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: true,
  },
  questionType: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
  explanation: {
    type: String,
    required: true,
  },
});

const lectureSchema = new mongoose.Schema(
  {
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Class',
      required: true,
    },
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    audioSource: {
      type: String,
      default: '',
    },
    summary: {
      keyTakeaways: [
        {
          type: String,
        },
      ],
      detailedNotes: {
        type: String,
        default: '',
      },
    },
    assessment: [questionSchema],
    status: {
      type: String,
      enum: ['draft', 'dispatched'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Lecture', lectureSchema);
