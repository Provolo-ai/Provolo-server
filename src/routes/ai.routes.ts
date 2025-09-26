import { Router } from "express";
import type { Router as ExpressRouter } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.ts";
import { optimizeProfile } from "../controllers/optimize.controller.ts";

const aiRouter: ExpressRouter = Router();

/**
 * @openapi
 * /api/v1/ai/optimize-upwork:
 *   post:
 *     summary: Optimize freelancer Upwork profile using AI
 *     description: Analyzes and optimizes a freelancer's Upwork profile content using AI to improve client attraction and profile effectiveness.
 *     tags:
 *       - AI
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: John Doe
 *                 description: Freelancer's full name (max 100 characters)
 *               professional_title:
 *                 type: string
 *                 example: Full Stack Developer
 *                 description: Professional title or role (max 200 characters)
 *               profile:
 *                 type: string
 *                 example: Experienced developer with 5+ years in web development...
 *                 description: Profile description or bio (max 1000 characters)
 *             required:
 *               - full_name
 *               - professional_title
 *               - profile
 *     responses:
 *       200:
 *         description: Profile optimization completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     weaknessesAndOptimization:
 *                       type: string
 *                     optimizedProfileOverview:
 *                       type: string
 *                     suggestedProjectTitles:
 *                       type: string
 *                     recommendedVisuals:
 *                       type: string
 *                     beforeAfterComparison:
 *                       type: string
 *       400:
 *         description: Bad Request - Invalid input validation
 *       401:
 *         description: Unauthorized - Unauthorized
 *       429:
 *         description: Too Many Requests - Daily limit exceeded
 *       500:
 *         description: Internal Server Error - AI service or client creation failed
 */
aiRouter.post("/optimize-upwork", authMiddleware, optimizeProfile);

export default aiRouter;
