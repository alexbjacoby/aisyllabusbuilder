import React, { useState } from 'react';

/**
 * This updated version uses Tailwind CSS for styling (so it's not in Times New Roman by default).
 * It also implements a "wizard" format: only one category (question set) is shown at a time.
 * Users can navigate through categories via next/previous buttons.
 * Finally, once they reach the end, they can click "Preview Draft Statement"
 * to generate the final statement in bold dark-red text as a single paragraph.
 */

function AISyllabusStatementBuilder() {
  // Step-based interface
  const [currentStep, setCurrentStep] = useState(1);

  // Selections stored in state
  const [selections, setSelections] = useState({
    generalPolicy: "",
    appliedTools: [],
    conditions: [],
    processes: [],
    rationale: "",
    consequences: "",
    support: "",
    positionStatement: "",
  });

  // Handler for radio inputs (only one choice per category).
  const handleRadioChange = (category, value) => {
    setSelections((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  // Handler for checkbox inputs (multiple choices).
  const handleCheckboxChange = (category, value) => {
    setSelections((prev) => {
      const currentVals = [...prev[category]];
      if (currentVals.includes(value)) {
        // Remove if currently selected
        return {
          ...prev,
          [category]: currentVals.filter((item) => item !== value),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          [category]: [...currentVals, value],
        };
      }
    });
  };

  // Prepare the final text, ensuring we don't accidentally add double periods.
  const generateParagraph = () => {
    const {
      generalPolicy,
      appliedTools,
      conditions,
      processes,
      rationale,
      consequences,
      support,
      positionStatement,
    } = selections;

    // Build an array of sentences if there's content, then join them into one paragraph.
    const lines = [];

    if (generalPolicy) {
      lines.push(`General policy about AI use in this course: ${generalPolicy}`);
    }
    if (appliedTools.length > 0) {
      lines.push(
        `The policy applies to the following AI tools: ${appliedTools.join("; ")}`
      );
    }
    if (conditions.length > 0) {
      lines.push(
        `The policy applies only under the following conditions: ${conditions.join("; ")}`
      );
    }
    if (processes.length > 0) {
      lines.push(
        `The following processes are in place regarding students using AI tools: ${processes.join(
          "; "
        )}`
      );
    }
    if (rationale) {
      lines.push(`The rationale for this policy is: ${rationale}`);
    }
    if (consequences) {
      lines.push(
        `The following consequences for non-compliance apply: ${consequences}`
      );
    }
    if (support) {
      lines.push(`Support resources available: ${support}`);
    }
    if (positionStatement) {
      lines.push(`Our position on supporting students: ${positionStatement}`);
    }

    // Combine everything into one paragraph, removing any double periods.
    // We'll just join with a single space, then ensure we add a period at the end.
    let paragraph = lines.join(" ");
    // Remove any accidental double or triple periods by replacing "...", ".." with a single "." 
    paragraph = paragraph
      .replace(/\.\.\./g, ".")
      .replace(/\.\./g, ".")
      .trim();

    // If the paragraph doesn't end in a period, add one.
    if (paragraph && !paragraph.endsWith(".")) {
      paragraph += ".";
    }

    return paragraph;
  };

  // Step content definitions (each step is one category)
  const steps = [
    {
      id: 1,
      title: "1. General policy about AI use in this course:",
      type: "radio",
      name: "generalPolicy",
      options: [
        "Students are allowed to use AI tools freely as they choose.",
        "Students are only allowed to use AI tools in the limited ways described below.",
        "Students are not allowed to use AI tools, except when certain conditions are met as described below.",
        "Students are never allowed to use AI tools",
        "Other:",
      ],
    },
    {
      id: 2,
      title: "2. The policy applies to the following AI tools:",
      type: "checkbox",
      name: "appliedTools",
      options: [
        "AI chatbots (such as ChatGPT, Google Gemini, Claude, CoPilot)",
        "AI image generators (such as DALL-E, Midjourney, Stable Diffusion, Adobe Firefly)",
        "AI code generators (such as CoPilot, Tabnine, Cody)",
        "AI audio or music generators (such as Amper, AIVA, Soundful)",
        "Specific tools:",
      ],
    },
    {
      id: 3,
      title: "3. The policy applies only under the following conditions:",
      type: "checkbox",
      name: "conditions",
      options: [
        "Only for specified assignments",
        "Only with proper citations and acknowledgment",
        "Only with supervision during class, section, or office hours",
        "Only after students have gained skills for using chatbots effectively",
        "Only by request and with the approval of the instructor or teaching team",
        "Only with your data. Do not enter private, sensitive, or copyrighted data from this course or others into AI tools without their consent.",
        "Only for graded assignments; for non-graded assignments, students may use AI tools",
        "For reflection, studying, and ideation. AI should only be used as a study aid, not to generate content for assignments.",
        "Other:",
      ],
    },
    {
      id: 4,
      title: "4. The following processes are in place regarding students using AI tools:",
      type: "checkbox",
      name: "processes",
      options: [
        "Students should contact the teaching team if they have questions about anything in this policy.",
        "Students must first talk to me during office hours or by email before using AI tools in this course",
        "Students are responsible for identifying and addressing any inaccurate, biased, offensive, or problematic AI-generated content that they use or cite.",
        "Students must check for possible plagiarism in the AI output, check for ideas that should be attributed to particular scholars, and verify any sources cited or generated by AI tools.",
        "Students must include an author’s statement in their work describing how they identified and addressed any issues such as plagiarism, bias, inaccuracies, and so on in AI-generated content or in AI interactions during the authoring process.",
        "Students must disclose the use of AI in their work, describing the specific way(s) in which AI was used and citing the system(s) used, dates of use, and where relevant how they were used (such as prompts used) in their documentation.",
        "Students must cite all AI outputs following either APA or MLA citation guidelines",
        "Students must include a metacognitive reflection section within their work describing how and why they used AI tools, their impacts on their learning, and how they might use them in the future.",
        "Students must agree to follow class community agreements about the responsible use of AI.",
        "Students must get informed consent from relevant parties whenever putting private, sensitive, or copyrighted information into a generative AI tool.",
        "Students must first demonstrate their AI literacy skills by completing…",
        "Other:",
      ],
    },
    {
      id: 5,
      title: "5. The rationale for this policy is:",
      type: "radio",
      name: "rationale",
      options: [
        "The students in this course have strong learning skills and have shown themselves to be responsible, effective, self-directed learners.",
        "I’ve designed robust assessments and learning activities in this course that have value regardless of the use of chatbots.",
        "The use of chatbots aligns with the goals of the course in a way that enhances learning.",
        "I consider learning to use AI tools an important skill in the discipline.",
        "Students are informed about AI, its risks and benefits, and can decide for themselves if and how they would use AI tools.",
        "Students need to first develop their AI literacy skills to demonstrate they can use chatbots effectively and responsibly.",
        "Chatbots would enhance learning in certain specific situations but could be a detriment outside of those situations.",
        "The teaching team only has enough resources to support students working with chatbots in limited ways.",
        "Students first need to understand issues around privacy and data security and consent to using a chatbot.",
        "It could enhance learning for certain students in unique circumstances but otherwise would likely inhibit learning.",
        "It depends on the individual student's goals, situation, skills, and needs that need to be evaluated on a case-by-case basis.",
        "As AI tools rapidly evolve, the teaching team needs more time to adapt the course to properly support students.",
        "Content in this course is private, sensitive, or copyrighted, and should not be entered into a chatbot.",
        "This course relies on pedagogic strategies that would be significantly undermined by allowing students to use AI tools.",
        "The course teaches skills that should be first mastered without the use of AI tools as a foundation for future learning.",
        "The assessments in this course require students to submit completely original work to provide useful feedback and accurately evaluate learning.",
        "The university and this course currently cannot provide secure and equitable access to the specified AI tools, so it would be unfair if only certain students could afford access.",
        "Other:",
      ],
    },
    {
      id: 6,
      title:
        "6. The following consequences for non-compliance with this policy apply:",
      type: "radio",
      name: "consequences",
      options: [
        "If a student is suspected of or reported for not following this policy, cases shall be referred to the Associate Provost or designee, who in consultation with the appropriate School Dean, shall determine which disciplinary sanctions, if any shall be imposed. The sanctions of suspension or dismissal shall not be imposed unless the Provost concurs.",
        "Student work that does not include the required elements (citations, author’s statement, etc.) shall receive a grade penalty of…",
      ],
    },
    {
      id: 7,
      title: "7. The following support resources are available:",
      type: "radio",
      name: "support",
      options: [
        "If you have any questions, please talk to me or someone from the teaching team. The best way to contact us is...",
        "Students will be able to create a free account for the specified tools using their CalArts email addresses. We will go over in class how to access them.",
        "AI use is not required and is entirely optional. Equivalent alternatives are provided for all students whether they choose to use AI tools or not.",
      ],
    },
    {
      id: 8,
      title:
        "8. The following statement expresses our position on supporting students:",
      type: "radio",
      name: "positionStatement",
      options: [
        "If you as a student are struggling and feeling too much pressure in this course, please don't resort to chatbots as a shortcut to completing assignments. Many CalArts students feel stressed and pressured. It is completely natural, as this is a challenging course and the university can be a high-pressure environment. But there are a lot of support resources available to you, and I believe that you can succeed here. Please contact me anytime and let's talk about it. I am open to extending due dates or adjusting the assignments to fit your situation. I will work with you to support your success in this course!",
        "A major goal for this course is for you to develop your creative voice and style. I want to know what you think, not what a chatbot thinks. If you are interested in using AI tools, I want you to be critical of them. These tools can be useful but also have significant shortcomings that are worth examining. Don’t let AI do the thinking for you or settle for generic AI content. It is important in our field to champion human voices and to be critical of how power is structured in society. My door is always open and I welcome you to reach out to me anytime to discuss how you might address AI in your work in this course.",
        "We recognize that you may have concerns about privacy and security, or have ethical or other reasons why you do not want to use AI tools in this class. This is completely understandable and we respect your choices. I and the teaching team are here to help you succeed in this course. Please email, visit office hours, or speak to me at any time so we can help you. I can accommodate or adapt course assignments for most students' situations. In the instances where I cannot, I can connect you to other campus resources that can help you.",
        "Generative AI tools can be helpful in our work in this course. But using these powerful tools comes with a lot of responsibility. I trust that you will hold yourselves to the highest standards of professionalism when using AI tools in our course. That means being transparent about using AI and submitting work that has original ideas and holds up the high standards of our university. Also, I trust that you will take responsibility for your interactions with AI. If AI generates something inaccurate, plagiarized, biased, offensive, unethical, or incorrectly attributed, I expect you to identify and address it. This is all to prepare you for future success as an academic scholar. I have so much faith in you! We are a community of learners who support each other, so please contact me anytime to talk about how we use AI tools in this course.",
        "Fairness and reciprocity between you and me are important to build a positive learning environment for us all. Thoughtful and responsible use of generative AI technology applies to everyone in this course, including me. I commit to following these same practices and policies when it comes to using AI tools for my work as a teacher in this course.",
      ],
    },
  ];

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onPreviewClick = () => {
    // Move to a special preview "step" beyond the normal steps (e.g., step 9)
    setCurrentStep(9);
  };

  // RENDER
  return (
    <div className="font-sans bg-gray-100 min-h-screen p-4">
      <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-4">AI Syllabus Statement Builder</h1>

        {currentStep <= steps.length && (
          <>
            {/* Show the current step */}
            <h2 className="text-lg font-semibold mb-2">
              {steps.find((s) => s.id === currentStep)?.title}
            </h2>
            {steps
              .find((s) => s.id === currentStep)
              ?.options.map((option) => {
                if (steps.find((s) => s.id === currentStep)?.type === "radio") {
                  // Radio
                  return (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name={steps.find((s) => s.id === currentStep)?.name}
                        value={option}
                        checked={
                          selections[
                            steps.find((s) => s.id === currentStep)?.name
                          ] === option
                        }
                        onChange={() =>
                          handleRadioChange(
                            steps.find((s) => s.id === currentStep)?.name,
                            option
                          )
                        }
                        className="mr-2"
                      />
                      <label>{option}</label>
                    </div>
                  );
                } else {
                  // Checkbox
                  return (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        value={option}
                        checked={selections[
                          steps.find((s) => s.id === currentStep)?.name
                        ].includes(option)}
                        onChange={() =>
                          handleCheckboxChange(
                            steps.find((s) => s.id === currentStep)?.name,
                            option
                          )
                        }
                        className="mr-2"
                      />
                      <label>{option}</label>
                    </div>
                  );
                }
              })}

            {/* Navigation buttons */}
            <div className="mt-4 flex justify-between">
              <button
                disabled={currentStep === 1}
                onClick={handlePrev}
                className="py-2 px-4 bg-gray-300 text-black font-semibold rounded disabled:opacity-50"
              >
                Previous
              </button>
              {currentStep < steps.length && (
                <button
                  onClick={handleNext}
                  className="py-2 px-4 bg-blue-600 text-white font-semibold rounded"
                >
                  Next
                </button>
              )}
              {currentStep === steps.length && (
                <button
                  onClick={onPreviewClick}
                  className="py-2 px-4 bg-blue-600 text-white font-semibold rounded"
                >
                  Preview Draft Statement
                </button>
              )}
            </div>
          </>
        )}

        {/* Step 9: PREVIEW */}
        {currentStep === 9 && (
          <div>
            <h2 className="text-lg font-bold mb-2">
              Preview of Your Syllabus Statement
            </h2>
            <p className="text-red-800 font-bold">
              {generateParagraph()}
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setCurrentStep(1)}
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AISyllabusStatementBuilder;