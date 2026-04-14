import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/apiError";

export const verifyAdmin = asyncHandler(async (req: any, _, next) => {
    // verifyJWT pehle chala hoga, isliye req.user mil jayega
    if (req.user?.role !== "admin") {
        throw new ApiError(403, "You do not have permission to perform this action. Admin only!");
    }
    next();
});