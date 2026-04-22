"use client";

import React, { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { useApi } from "@/hooks/useApi";
import { attemptsService, testsService } from "@/services/tests.service";
import type { TestQuestion as ApiTestQuestion } from "@/services/types";

import TestCodeEntry from "./TestCodeEntry";
import TestGuidelines from "./TestGuidelines";
import TestPage from "./TestPage";
import TestResultModal from "./TestResultModal";
import { testGuidelines, toTestInfo } from "./data";
import type { TestQuestion, TestResult, UserAnswer } from "./types";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" as const },
  },
};

type Step = "code-entry" | "guidelines" | "test" | "result";

function fromApiQuestion(q: ApiTestQuestion): TestQuestion {
  if (q.type === "MCQ") {
    return {
      id: q.id,
      type: "mcq",
      question: q.prompt,
      marks: q.marks,
      options: q.options.map((o) => ({ id: o.id, text: o.text })),
    };
  }
  return {
    id: q.id,
    type: "text",
    question: q.prompt,
    marks: q.marks,
  };
}

export default function TestFlowView() {
  const { testId } = useParams<{ testId: string }>();
  const router = useRouter();
  const [step, setStep] = useState<Step>("code-entry");
  const [result, setResult] = useState<TestResult | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const { data: apiTest, loading: testLoading } = useApi(
    () => (testId ? testsService.findById(testId) : Promise.resolve(null)),
    [testId],
  );
  const { data: apiQuestions, loading: questionsLoading } = useApi(
    () => (testId ? testsService.questions(testId) : Promise.resolve([])),
    [testId],
  );

  const test = useMemo(() => (apiTest ? toTestInfo(apiTest) : null), [apiTest]);
  const questions = useMemo(() => (apiQuestions ?? []).map(fromApiQuestion), [apiQuestions]);

  const handleCodeValid = useCallback(() => {
    setStep("guidelines");
  }, []);

  const handleBeginTest = useCallback(async () => {
    if (!testId) return;
    try {
      const attempt = await attemptsService.start(testId);
      setAttemptId(attempt.id);
    } catch (err) {
      console.warn("Failed to start attempt", err);
    }
    setStep("test");
  }, [testId]);

  const handleSubmit = useCallback(
    async (answers: UserAnswer[], timeTaken: number) => {
      const attempted = answers.filter((a) => a.answer.trim() !== "").length;

      if (attemptId) {
        try {
          for (const ans of answers) {
            if (!ans.answer) continue;
            const question = questions.find((q) => q.id === ans.questionId);
            if (!question) continue;
            if (question.type === "mcq") {
              await attemptsService.answer(attemptId, {
                questionId: ans.questionId,
                selectedOptionIds: [ans.answer],
              });
            } else {
              await attemptsService.answer(attemptId, {
                questionId: ans.questionId,
                textAnswer: ans.answer,
              });
            }
          }
          await attemptsService.submit(attemptId);
        } catch (err) {
          console.warn("Failed to submit attempt", err);
        }
      }

      const now = new Date();
      const submittedAt = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      setResult({
        totalQuestions: questions.length,
        attempted,
        timeTaken,
        submittedAt,
      });
      setStep("result");
    },
    [attemptId, questions],
  );

  const handleCloseResult = useCallback(() => {
    router.push("/student/tests");
  }, [router]);

  if (testLoading || questionsLoading || !test) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#A1A1AA] text-sm">
        Loading test…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {(step === "code-entry" || step === "guidelines") && (
        <motion.div
          className="p-6 lg:p-8 pb-0 max-w-7xl mx-auto w-full"
          initial="hidden"
          animate="visible"
          variants={fadeUp}
        >
          <div className="flex items-center gap-2 text-[13px] text-[#A1A1AA] font-medium">
            <Link
              href="/student"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <Link
              href="/student/tests"
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tests
            </Link>
            <ChevronRight size={14} className="opacity-50" />
            <span className="text-[#F2F2F2]">{test.title}</span>
          </div>
        </motion.div>
      )}

      <div className="flex-1">
        {step === "code-entry" && (
          <TestCodeEntry
            expectedCode={test.testCode}
            testTitle={test.title}
            onCodeValid={handleCodeValid}
          />
        )}
        {step === "guidelines" && (
          <div className="p-6 lg:px-8 pt-0 max-w-7xl mx-auto w-full">
            <TestGuidelines
              test={test}
              guidelines={testGuidelines}
              onBeginTest={handleBeginTest}
            />
          </div>
        )}
        {step === "test" && (
          <TestPage test={test} questions={questions} onSubmit={handleSubmit} />
        )}
      </div>

      {step === "result" && result && (
        <TestResultModal
          result={result}
          totalQuestions={questions.length}
          onClose={handleCloseResult}
        />
      )}
    </div>
  );
}
