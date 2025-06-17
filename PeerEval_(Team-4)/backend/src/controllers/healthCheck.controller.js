import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from 'express-async-handler';


const healthCheck = asyncHandler(
    async (request, response) => {
        response.status(200)
        .json(new ApiResponse(
            200,
            "All is Well...",
            "Health Check passed at " + new Date()
        ));
    }
);

export default healthCheck;