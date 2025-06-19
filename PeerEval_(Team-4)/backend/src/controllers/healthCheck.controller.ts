import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import ApiResponse from '../utils/apiResponse'; // Make sure this is a .ts file or has proper type exports

const healthCheck = asyncHandler(async (request: Request, response: Response) => {
    response.status(200).json(
        new ApiResponse(
            200,
            "All is Well...",
            `Health Check passed at ${new Date().toISOString()}`
        )
    );
});

export default healthCheck;
