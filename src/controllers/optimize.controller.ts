import { Request, Response } from "express";
import {
  checkOptimizerQuotaForUser,
  updateUserPromptLimit,
  optimizerPrompt,
  optimizerSystemInstruction,
} from "../utils/prompt.utils.js";
import { callGemini } from "../utils/geminiClient.js";
import { newErrorResponse, newSuccessResponse } from "../utils/apiResponse.ts";

interface PromptReq {
  full_name: string;
  professional_title: string;
  profile: string;
}

export async function optimizeProfile(req: Request, res: Response) {
  try {
    // 1. Get user ID from auth middleware
    const userId = req.userID as string;
    if (!userId) {
      return res.status(401).json(newErrorResponse("Unauthorized", "User not authenticated"));
    }

    // 2. Check quota
    let quotaResult;
    try {
      quotaResult = await checkOptimizerQuotaForUser(userId);
      console.log("Quota result for user", userId, ":", quotaResult);
    } catch (err: any) {
      console.error("[optimizeProfile] Quota check error:", err);
      return res
        .status(500)
        .json(
          newErrorResponse(
            "Internal Server Error",
            "An error occurred. Please try again or contact support."
          )
        );
    }
    if (!quotaResult.allowed) {
      return res
        .status(429)
        .json(
          newErrorResponse(
            "Quota Exceeded",
            `Quota limit exceeded for profile optimizer. Current usage: ${quotaResult.count}/${quotaResult.limit}. Try again in the next period.`
          )
        );
    }

    // 3. Validate input
    const { full_name, professional_title, profile } = req.body as PromptReq;
    if (!full_name || !professional_title || !profile) {
      return res
        .status(400)
        .json(
          newErrorResponse(
            "Invalid Request",
            "Missing required fields: full_name, professional_title, profile"
          )
        );
    }
    if (full_name.length > 100 || professional_title.length > 200 || profile.length > 5000) {
      return res
        .status(400)
        .json(newErrorResponse("Validation Error", "Input fields exceed allowed length."));
    }

    // 4. Sanitize input (simple trim)
    const sanitizedFullName = full_name.trim();
    const sanitizedTitle = professional_title.trim();
    const sanitizedProfile = profile.trim();

    const inputContent = `Freelancer Name: ${sanitizedFullName}\nTitle: ${sanitizedTitle}\n\n Profile Description:\n${sanitizedProfile}`;
    const content = optimizerPrompt(inputContent);

    // 5. Call AI model (replace with your actual AI call)
    let aiResponseText = "";
    try {
      aiResponseText = await callGemini(content, optimizerSystemInstruction());
    } catch (err: any) {
      console.error("[optimizeProfile] AI service call failed:", err);
      return res
        .status(500)
        .json(
          newErrorResponse(
            "AI Service Error",
            "An error occurred. Please try again or contact support."
          )
        );
    }

    // 6. Parse AI response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponseText);
    } catch (err) {
      console.error(
        "[optimizeProfile] Failed to parse AI response:",
        err,
        "Response text:",
        aiResponseText
      );
      return res
        .status(500)
        .json(
          newErrorResponse(
            "Processing Error",
            "An error occurred. Please try again or contact support."
          )
        );
    }

    // 7. Update quota after success
    // Only increment quota if the tier is limited
    if (quotaResult.limit !== -1) {
      try {
        await updateUserPromptLimit(userId);
      } catch (err) {
        // Log but do not fail the request
        console.warn("Warning: Failed to update quota for user", userId, err);
      }
    }

    // 8. Return success
    return res
      .status(200)
      .json(
        newSuccessResponse(
          "Optimization Successful",
          "Profile optimized successfully",
          parsedResponse
        )
      );
  } catch (err) {
    // Top-level catch for any unexpected errors
    console.error("[optimizeProfile] Unhandled error:", err);
    return res
      .status(500)
      .json(
        newErrorResponse(
          "Internal Server Error",
          "An error occurred. Please try again or contact support."
        )
      );
  }
}
