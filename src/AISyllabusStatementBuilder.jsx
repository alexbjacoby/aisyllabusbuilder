import React, { useState } from 'react';

/*
  AISyllabusStatementBuilder
  ------------------------------------------------------------
  Updates requested:
  1. Rationale step (step 5) now has four major options:
     - "Students are allowed to use AI tools freely as they choose because…"
     - "Students are only allowed to use AI tools in limited ways described below because…"
     - "Students are not allowed to use AI tools, except when certain conditions are met as described below because…"
     - "Students are not allowed to use specified AI tools because…"
  
     When they choose the first option, show a set of 6 sub-options:
       - "The students in this course have strong learning skills and have shown themselves to be responsible, effective, self-directed learners."
       - "I’ve designed robust assessments and learning activities in this course that have value regardless of the use of chatbots."
       - "The use of chatbots aligns with the goals of the course in a way that enhances learning."
       - "I consider learning to use AI tools an important skill in the discipline."
       - "Students are informed about AI, its risks and benefits, and can decide for themselves if and how they would use AI tools."
       - "Other:"

     These sub-options will be checkboxes so users can pick multiple reasons.
  
  2. Add a "Copy this statement" button on the final preview page (step 9),
     which copies the final statement to clipboard.
  
  3. Display the CalArts logo (from the provided SVG URL) at the top of each page:
     <img src="https://upload.wikimedia.org/wikipedia/commons/d/d7/Calarts_logo.svg" alt="CalArts Logo" />
  
  This is a single React component with Tailwind classes,
  ensuring no arbitrary width/height overrides. 
  Everything is contained in one file, and the user can
  navigate through steps. Tailwind must be properly configured
  in the app for styling to appear.
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
    rationaleCategory: "",   // new "big category" rationale
    rationaleSub: [],       // sub-options for rationale (only appear if rationaleCategory is first option)
    consequences: "",
    support: "",
    positionStatement: "",
  });

  // Handler for radio inputs (only one choice per category).
  const handleRadioChange = (category, value) => {
    setSelections((prev) => ({
      ...prev,
      [category]: value,
      // If the user chooses a different rationaleCategory, reset the sub rationale
      ...(category === "rationaleCategory" ? { rationaleSub: [] } : {}),
    }));
  };

  // Handler for checkbox inputs (multiple choices).
  const handleCheckboxChange = (category, value) => {
    setSelections((prev) => {
      const currentVals = Array.isArray(prev[category])
        ? [...prev[category]]
        : [];
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

    // Rationale big category
    if (rationaleCategory) {
      lines.push(`Rationale for this policy: ${rationaleCategory}`);
      // If it is the first option, show sub reasons
      if (
        rationaleCategory ===
        "Students are allowed to use AI tools freely as they choose because…"
      ) {
        if (rationaleSub && rationaleSub.length > 0) {
          lines.push(`Reasons include: ${rationaleSub.join("; ")}`);
        }
      }
    }

    if (consequences) {
      lines.push(`The following consequences for non-compliance apply: ${consequences}`);
    }

    if (support) {
      lines.push(`Support resources available: ${support}`);
    }

    if (positionStatement) {
      lines.push(`Our position on supporting students: ${positionStatement}`);
    }

    // Combine everything into one paragraph, removing extra periods
    let paragraph = lines.join(" ");
    paragraph = paragraph
      .replace(/\.\.\./g, ".")
      .replace(/\.\./g, ".")
      .trim();

    // If the paragraph doesn't end in a period, add one.
    if (paragraph && !/[.!?]$/.test(paragraph)) {
      paragraph += ".";
    }

    return paragraph;
  };

  // STEPS
  // 1. General policy
  // 2. The policy applies to the following AI tools
  // 3. The policy applies only under the following conditions
  // 4. The following processes are in place
  // 5. Rationale for this policy (4 big radio categories + sub-options if first is chosen)
  // 6. The following consequences for non-compliance
  // 7. The following support resources are available
  // 8. A statement on supporting students
  // 9. Preview
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
        "Only with your data. Do not enter private, sensitive, or copyrighted data from this course or others into AI tools.",
        "Only for graded assignments; for non-graded assignments, students may use AI tools",
        "For reflection, studying, and ideation. AI should only be used as a study aid, not to generate content for assignments.",
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
      title: "Rationale for this policy:",
      type: "rationale-step",
      name: "rationaleCategory",
      // We'll handle options ourselves in the code below, because it's more complex structure
      options: [
        "Students are allowed to use AI tools freely as they choose because…",
        "Students are only allowed to use AI tools in limited ways described below because…",
        "Students are not allowed to use AI tools, except when certain conditions are met as described below because…",
        "Students are not allowed to use specified AI tools because…",
      ],
      // If the user picks the first option, we show suboptions:
      subOptions: [
        "The students in this course have strong learning skills and have shown themselves to be responsible, effective, self-directed learners.",
        "I’ve designed robust assessments and learning activities in this course that have value regardless of the use of chatbots.",
        "The use of chatbots aligns with the goals of the course in a way that enhances learning.",
        "I consider learning to use AI tools an important skill in the discipline.",
        "Students are informed about AI, its risks and benefits, and can decide for themselves if and how they would use AI tools.",
        "Other:",
      ],
    },
    {
      id: 6,
      title:
        "The following consequences for non-compliance with this policy apply:",
      type: "radio",
      name: "consequences",
      options: [
        "If a student is suspected of or reported for not following this policy, cases shall be referred to the Associate Provost or designee, who in consultation with the appropriate School Dean, shall determine which disciplinary sanctions, if any shall be imposed. The sanctions of suspension or dismissal shall not be imposed unless the Provost concurs.",
        "Student work that does not include the required elements (citations, author’s statement, etc.) shall receive a grade penalty of…",
      ],
    },
    {
      id: 7,
      title: "The following support resources are available:",
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
        "This statement expresses our position on supporting students:",
      type: "radio",
      name: "positionStatement",
      options: [
        "If you as a student are struggling and feeling too much pressure in this course, please don't resort to chatbots as a shortcut...",
        "A major goal for this course is for you to develop your creative voice and style. I want to know what you think...",
        "We recognize that you may have concerns about privacy and security, or have ethical or other reasons why you do not want to use AI tools in this class...",
        "Generative AI tools can be helpful in our work in this course. But using these powerful tools comes with a lot of responsibility...",
        "Fairness and reciprocity between you and me are important to build a positive learning environment for us all...",
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
    setCurrentStep(9);
  };

  // Copy-to-clipboard
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
        {/* CalArts logo at top of each page */}
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

        {/* Steps 1..8 */}
        {currentStep <= steps.length && (
          <>
            <h2 className="text-lg font-semibold mb-2">
              {steps.find((s) => s.id === currentStep)?.title}
            </h2>

            {/* If it’s step 5, we have a special case */}
            {steps.find((s) => s.id === currentStep)?.type === "rationale-step" && (
              <div className="mb-4">
                {/* Show the main radio categories */}
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

                {/* If user picked the first option, show sub-options */}
                {selections.rationaleCategory ===
                  "Students are allowed to use AI tools freely as they choose because…" && (
                  <div className="mt-4 ml-4 border-l pl-4">
                    <p className="text-sm mb-2">Select your reasoning (choose any that apply):</p>
                    {steps.find((s) => s.id === currentStep)?.subOptions.map((sub) => (
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

            {/* If it’s not the special rationale step, handle radio/checkbox in the usual way */}
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
                    // checkbox
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

            {/* Navigation buttons: Prev / Next / Preview */}
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
