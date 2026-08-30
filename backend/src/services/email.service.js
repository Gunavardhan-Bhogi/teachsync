import { transporter } from '../config/mailer.js';

/**
 * Converts basic markdown formatting to HTML for email compatibility.
 */
const simpleMarkdownToHtml = (markdownText = '') => {
  if (!markdownText) return '';
  return markdownText
    .replace(/^### (.*$)/gim, '<h3 style="color: #1e293b; margin-top: 20px; margin-bottom: 10px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color: #0f172a; margin-top: 24px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color: #0f172a; margin-top: 28px; margin-bottom: 16px;">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^\* (.*$)/gim, '<li style="margin-bottom: 6px;">$1</li>')
    .replace(/^- (.*$)/gim, '<li style="margin-bottom: 6px;">$1</li>')
    .replace(/\n\n/g, '<br/><br/>');
};

/**
 * Generates an elegant HTML email template for lecture notes and student assessment quiz.
 */
const renderLectureEmailTemplate = ({ className, subject, topic, summary, assessment }) => {
  const keyTakeawaysHtml = (summary?.keyTakeaways || [])
    .map((point) => `<li style="margin-bottom: 8px; color: #334155;">${point}</li>`)
    .join('');

  const detailedNotesHtml = simpleMarkdownToHtml(summary?.detailedNotes || '');

  const questionsHtml = (assessment || [])
    .map((q) => {
      let detailsHtml = '';

      if (q.questionType === 'mcq' && q.options && q.options.length > 0) {
        detailsHtml = `<ol type="A" style="margin-top: 8px; margin-bottom: 12px; padding-left: 20px; color: #475569;">
            ${q.options.map((opt) => `<li style="margin-bottom: 4px;">${opt}</li>`).join('')}
           </ol>`;
      } else if (q.questionType === 'short_answer' || q.questionType === 'fill_in_the_blank') {
        detailsHtml = `<p style="margin: 8px 0 12px 0; color: #475569; font-size: 14px;">
            <strong>Answer:</strong> ${q.correctAnswer || ''}
          </p>`;
      }

      return `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <p style="margin: 0 0 8px 0; font-weight: 600; color: #1e293b;">
            Q${q.questionNumber}. ${q.question}
          </p>
          ${detailsHtml}
        </div>
      `;
    })
    .join('');

  const answerKeyHtml = (assessment || [])
    .map(
      (q) => `
        <div style="border-left: 3px solid #3b82f6; padding-left: 12px; margin-bottom: 12px;">
          <p style="margin: 0; font-weight: 600; color: #1e293b;">
            Q${q.questionNumber} Correct Answer: <span style="color: #2563eb;">${q.correctAnswer}</span>
          </p>
          <p style="margin: 4px 0 0 0; font-size: 14px; color: #64748b;">
            <em>Explanation:</em> ${q.explanation}
          </p>
        </div>
      `
    )
    .join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${topic} - Lecture Notes & Quiz</title>
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px;">
    <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; padding: 32px 24px; text-align: center;">
        <span style="background-color: rgba(255, 255, 255, 0.2); font-size: 12px; font-weight: 600; letter-spacing: 1px; padding: 4px 12px; border-radius: 20px; text-transform: uppercase;">
          TeachSync Lecture Summary
        </span>
        <h1 style="margin: 16px 0 8px 0; font-size: 26px; font-weight: 700;">${topic}</h1>
        <p style="margin: 0; font-size: 15px; opacity: 0.9;">${className} &bull; ${subject}</p>
      </div>

      <div style="padding: 32px 24px;">
        
        <!-- Key Takeaways -->
        ${
          keyTakeawaysHtml
            ? `
        <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
          <h2 style="margin-top: 0; margin-bottom: 12px; font-size: 18px; color: #1e40af; display: flex; align-items: center;">
            <span style="margin-right: 8px;">💡</span> Key Takeaways
          </h2>
          <ul style="margin: 0; padding-left: 20px;">
            ${keyTakeawaysHtml}
          </ul>
        </div>
        `
            : ''
        }

        <!-- Detailed Notes -->
        <div style="margin-bottom: 32px; color: #334155; line-height: 1.6;">
          <h2 style="font-size: 20px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">
            📖 Detailed Lecture Notes
          </h2>
          ${detailedNotesHtml}
        </div>

        <!-- Self-Assessment Quiz -->
        ${
          questionsHtml
            ? `
        <div style="margin-bottom: 32px;">
          <h2 style="font-size: 20px; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px;">
            ✏️ Self-Assessment Quiz
          </h2>
          ${questionsHtml}
        </div>
        `
            : ''
        }

        <!-- Answer Keys & Explanations -->
        ${
          answerKeyHtml
            ? `
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
          <h3 style="margin-top: 0; margin-bottom: 16px; font-size: 16px; color: #334155;">
            🔍 Answer Key & Explanations
          </h3>
          ${answerKeyHtml}
        </div>
        `
            : ''
        }

      </div>

      <!-- Footer -->
      <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px; text-align: center; color: #94a3b8; font-size: 13px;">
        <p style="margin: 0;">Sent via <strong>TeachSync</strong> - Ambient Teacher Lecture Assistant</p>
      </div>

    </div>
  </body>
  </html>
  `;
};

/**
 * Dispatches lecture notes and quiz to all student emails in a class.
 * 
 * @param {Object} classData - Class document containing students list
 * @param {Object} lectureData - Lecture document containing topic, summary, assessment
 * @returns {Promise<Object>} Status report of sent emails
 */
export const sendLectureEmails = async (classData, lectureData) => {
  if (!classData.students || classData.students.length === 0) {
    throw new Error('No student recipients found for this class.');
  }

  const recipientEmails = classData.students.map((student) => student.email).filter(Boolean);

  if (recipientEmails.length === 0) {
    throw new Error('No valid student email addresses found.');
  }

  const htmlContent = renderLectureEmailTemplate({
    className: classData.className,
    subject: classData.subject,
    topic: lectureData.topic,
    summary: lectureData.summary,
    assessment: lectureData.assessment,
  });

  const mailOptions = {
    from: process.env.EMAIL_USER ? `"TeachSync" <${process.env.EMAIL_USER}>` : '"TeachSync Assistant" <no-reply@teachsync.com>',
    to: recipientEmails.join(', '),
    subject: `[TeachSync] Lecture Notes & Quiz: ${lectureData.topic} (${classData.className})`,
    html: htmlContent,
  };

  const info = await transporter.sendMail(mailOptions);
  return {
    messageId: info.messageId,
    recipientsCount: recipientEmails.length,
    recipients: recipientEmails,
  };
};
