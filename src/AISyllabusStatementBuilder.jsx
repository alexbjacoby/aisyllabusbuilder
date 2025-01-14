import React, { useState } from 'react';

/*
  AISyllabusStatementBuilder
  ------------------------------------------------------------
  Updates requested:
  1) The "Rationale for this policy" section (step 5) has four big categories:
     - "Students are allowed to use AI tools freely as they choose because…"
     - "Students are only allowed to use AI tools in limited ways described below because…"
     - "Students are not allowed to use AI tools, except when certain conditions are met as described below because…"
     - "Students are not allowed to use specified AI tools because…"

     Each of these four categories should also display a set of sub-options
     (checkboxes). By default, we’ll assume the same sub-options for all four
     big categories, but you can adjust them if needed.

  2) Show the sub-options whenever the user selects one of the four
     big categories. The first example was already done. Now we extend that
     to all rationale options, so that they all show sub-options.

  3) A "Copy this statement" button on the last page (step 9), which copies
     the final statement to the clipboard.

  4) Display the CalArts logo (from the provided SVG URL) at the top
     of each page:
     <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Calarts_logo.svg" alt="CalArts Logo" />

  This is a standalone component, using only React + Tailwind.
  Make sure you have Tailwind properly set up in your project.
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
    rationaleCategory: "", // big rationale category
    rationaleSub: [],      // sub-options for whichever rationaleCategory
    consequences: "",
    support: "",
    positionStatement: "",
  });

  // Sub-options for the four rationale categories (assuming the same set for now)
  const rationaleSubMap = {
    "Students are allowed to use AI tools freely as they choose because…": [
      "The students in this course have strong learning skills and have shown themselves to be responsible, effective, self-directed learners.",
      "I’ve designed robust assessments and learning activities in this course that have value regardless of the use of chatbots.",
      "The use of chatbots aligns with the goals of the course in a way that enhances learning.",
      "I consider learning to use AI tools an important skill in the discipline.",
      "Students are informed about AI, its risks and benefits, and can decide for themselves if and how they would use AI tools.",
      "Other:",
    ],
    "Students are only allowed to use AI tools in limited ways described below because…": [
      "The students in this course have strong learning skills and have shown themselves to be responsible, effective, self-directed learners.",
      "I’ve designed robust assessments and learning activities in this course that have value regardless of the use of chatbots.",
      "The use of chatbots aligns with the goals of the course in a way that enhances learning.",
      "I consider learning to use AI tools an important skill in the discipline.",
      "Students are informed about AI, its risks and benefits, and can decide for themselves if and how they would use AI tools.",
      "Other:",
    ],
    "Students are not allowed to use AI tools, except when certain conditions are met as described below because…": [
      "The students in this course have strong learning skills and have shown themselves to be responsible, effective, self-directed learners.",
      "I’ve designed robust assessments and learning activities in this course that have value regardless of the use of chatbots.",
      "The use of chatbots aligns with the goals of the course in a way that enhances learning.",
      "I consider learning to use AI tools an important skill in the discipline.",
      "Students are informed about AI, its risks and benefits, and can decide for themselves if and how they would use AI tools.",
      "Other:",
    ],
    "Students are not allowed to use specified AI tools because…": [
      "The students in this course have strong learning skills and have shown themselves to be responsible, effective, self-directed learners.",
      "I’ve designed robust assessments and learning activities in this course that have value regardless of the use of chatbots.",
      "The use of chatbots aligns with the goals of the course in a way that enhances learning.",
      "I consider learning to use AI tools an important skill in the discipline.",
      "Students are informed about AI, its risks and benefits, and can decide for themselves if and how they would use AI tools.",
      "Other:",
    ],
  };

  // Handler for radio inputs (only one choice per category).
  const handleRadioChange = (category, value) => {
    // If the user changes rationaleCategory, reset sub rationale 
    setSelections((prev) => ({
      ...prev,
      [category]: value,
      ...(category === "rationaleCategory" ? { rationaleSub: [] } : {}),
    }));
  };

  // Handler for checkbox inputs (multiple choices).
  const handleCheckboxChange = (category, value) => {
    setSelections((prev) => {
      const currentVals = Array.isArray(prev[category]) ? [...prev[category]] : [];
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

  // Build final text, merging user selections, removing double periods
  const generateParagraph = () => {
    const {
      generalPolicy,
      appliedTools,
      conditions,
      processes,
      rationaleCategory,
      rationaleSub,
      consequences,
      support,
      positionStatement,
    } = selections;

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
        `The following processes are in place regarding students using AI tools: ${processes.join("; ")}`
      );
    }

    if (rationaleCategory) {
      lines.push(`Rationale for this policy: ${rationaleCategory}`);
      // If the user selected a big category, see if there are sub-options stored
      if (rationaleSub && rationaleSub.length > 0) {
        lines.push(`Reasons include: ${rationaleSub.join("; ")}`);
      }
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

    // Combine everything into one paragraph, removing double/triple periods
    let paragraph = lines.join(" ");
    paragraph = paragraph
      .replace(/\.\.\./g, ".")
      .replace(/\.\./g, ".")
      .trim();

    // If final doesn't end with punctuation, add period
    if (paragraph && !/[.!?]$/.test(paragraph)) {
      paragraph += ".";
    }
    return paragraph;
  };

  // Steps 1-8, then 9 = preview
  const steps = [
    {
      id: 1,
      title: "General policy about AI use in this course:",
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
      title: "The policy applies to the following AI tools:",
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
      title: "The policy applies only under the following conditions:",
      type: "checkbox",
      name: "conditions",
      options: [
        "Only for specified assignments",
        "Only with proper citations and acknowledgment",
        "Only with supervision during class, section, or office hours",
        "Only after students have gained skills for using chatbots effectively",
        "Only by request and with the approval of the instructor or teaching team",
        "Only with your data. Do not enter private, sensitive, or copyrighted data",
        "Only for graded assignments; for non-graded assignments, students may use AI tools",
        "For reflection, studying, and ideation. AI should only be used as a study aid",
        "Other:",
      ],
    },
    {
      id: 4,
      title:
        "The following processes are in place regarding students using AI tools:",
      type: "checkbox",
      name: "processes",
      options: [
        "Students should contact the teaching team if they have questions about anything in this policy.",
        "Students must first talk to me before using AI tools in this course",
        "Students are responsible for identifying and addressing any inaccurate or biased AI-generated content",
        "Students must check for possible plagiarism in the AI output and verify any sources",
        "Students must include an author’s statement describing how they addressed AI issues",
        "Students must disclose the use of AI in their work and cite the system(s) used",
        "Students must cite all AI outputs using APA or MLA citation guidelines",
        "Students must include a metacognitive reflection section about their AI usage",
        "Students must agree to follow class community agreements about the responsible use of AI",
        "Students must get informed consent from relevant parties if inputting private data",
        "Students must first demonstrate their AI literacy skills by completing…",
        "Other:",
      ],
    },
    {
      id: 5,
      title: "Rationale for this policy:",
      type: "rationale-step",
      name: "rationaleCategory",
      options: [
        "Students are allowed to use AI tools freely as they choose because…",
        "Students are only allowed to use AI tools in limited ways described below because…",
        "Students are not allowed to use AI tools, except when certain conditions are met as described below because…",
        "Students are not allowed to use specified AI tools because…",
      ],
    },
    {
      id: 6,
      title: "The following consequences for non-compliance apply:",
      type: "radio",
      name: "consequences",
      options: [
        "If a student is suspected of violating this policy, it may be referred to the Associate Provost or designee...",
        "Student work missing required AI disclosures or statements shall receive a grade penalty of…",
      ],
    },
    {
      id: 7,
      title: "The following support resources are available:",
      type: "radio",
      name: "support",
      options: [
        "If you have any questions, please talk to me or the teaching team. Best way to contact us is...",
        "Students can create free accounts for the specified tools using their CalArts email. We’ll go over access in class.",
        "AI use is optional. Equivalent alternatives are provided even if you choose not to use AI tools.",
      ],
    },
    {
      id: 8,
      title: "This statement expresses our position on supporting students:",
      type: "radio",
      name: "positionStatement",
      options: [
        "If you are struggling, please don't rely on chatbots as a shortcut. Many CalArts students feel stress...",
        "A major goal is for you to develop your creative voice. I want to know what you think, not a chatbot...",
        "We recognize you may have privacy or ethical concerns about AI usage. We respect your choices...",
        "Generative AI can be helpful, but requires responsibility. If AI generates something inaccurate, you must address it...",
        "Fairness and reciprocity are important. We all follow these guidelines for AI, including me...",
      ],
    },
  ];

  // Navigation
  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };
  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  const onPreviewClick = () => {
    setCurrentStep(9);
  };

  // Copy to clipboard
  const handleCopyStatement = async () => {
    try {
      await navigator.clipboard.writeText(generateParagraph());
      alert("Statement copied to clipboard!");
    } catch (err) {
      alert("Failed to copy statement. Please copy manually.");
    }
  };

  // RENDER
  return (
    <div className="font-sans bg-gray-100 min-h-screen p-4">
      <div className="max-w-3xl mx-auto bg-white rounded shadow p-6">
        {/* CalArts logo at the top of each page */}
        <div className="flex justify-center mb-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Calarts_logo.svg"
            alt="CalArts Logo"
            className="w-32 h-auto"
          />
        </div>

        <h1 className="text-2xl font-bold mb-4 text-center">
          AI Syllabus Statement Builder
        </h1>

        {/* Show steps 1..8 */}
        {currentStep <= steps.length && (
          <>
            <h2 className="text-lg font-semibold mb-2">
              {steps.find((s) => s.id === currentStep)?.title}
            </h2>

            {/* The rationale step is special */}
            {steps.find((s) => s.id === currentStep)?.type === "rationale-step" && (
              <div className="mb-4">
                {/* Big rationale categories as radio */}
                {steps
                  .find((s) => s.id === currentStep)
                  ?.options.map((option) => (
                    <div key={option} className="flex items-center mb-2">
                      <input
                        type="radio"
                        name="rationaleCategory"
                        value={option}
                        checked={selections.rationaleCategory === option}
                        onChange={() => handleRadioChange("rationaleCategory", option)}
                        className="mr-2"
                      />
                      <label>{option}</label>
                    </div>
                  ))}

                {/* If the user selected any of these 4 categories, show sub options */}
                {!!rationaleSubMap[selections.rationaleCategory] && (
                  <div className="mt-4 ml-4 border-l pl-4">
                    <p className="text-sm mb-2">Select your reasoning (choose any that apply):</p>
                    {rationaleSubMap[selections.rationaleCategory].map((sub) => (
                      <div key={sub} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          value={sub}
                          checked={selections.rationaleSub.includes(sub)}
                          onChange={() => handleCheckboxChange("rationaleSub", sub)}
                          className="mr-2"
                        />
                        <label>{sub}</label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Standard radio/checkbox steps */}
            {steps.find((s) => s.id === currentStep)?.type !== "rationale-step" &&
              steps
                .find((s) => s.id === currentStep)
                ?.options.map((option) => {
                  const stepData = steps.find((s) => s.id === currentStep);
                  if (stepData?.type === "radio") {
                    return (
                      <div key={option} className="flex items-center mb-2">
                        <input
                          type="radio"
                          name={stepData.name}
                          value={option}
                          checked={selections[stepData.name] === option}
                          onChange={() => handleRadioChange(stepData.name, option)}
                          className="mr-2"
                        />
                        <label>{option}</label>
                      </div>
                    );
                  } else {
                    // type === "checkbox"
                    return (
                      <div key={option} className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          value={option}
                          checked={selections[stepData.name].includes(option)}
                          onChange={() => handleCheckboxChange(stepData.name, option)}
                          className="mr-2"
                        />
                        <label>{option}</label>
                      </div>
                    );
                  }
                })}

            {/* Navigation: Prev / Next / Preview */}
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

        {/* Step 9: Preview & Copy */}
        {currentStep === 9 && (
          <div>
            <h2 className="text-lg font-bold mb-2 text-center">
              Preview of Your Syllabus Statement
            </h2>
            <p className="text-red-800 font-bold leading-relaxed mb-4">
              {generateParagraph()}
            </p>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleCopyStatement}
                className="py-2 px-4 bg-green-600 text-white font-semibold rounded"
              >
                Copy this statement
              </button>
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
