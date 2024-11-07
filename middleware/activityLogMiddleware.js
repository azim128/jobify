import ActivityLog from "../models/ActivityLog.js";

export const logActivity = (resource) => {
  return async (req, res, next) => {
    // Store the original send function
    const originalSend = res.json;

    // Capitalize first letter of resource for model reference
    const capitalizedResource =
      resource.charAt(0).toUpperCase() + resource.slice(1);

    // Override the send function
    res.json = async function (data) {
      // Restore the original send function
      res.json = originalSend;

      // Only log if the request was successful (status 2xx)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          let action;
          let resourceId;
          let details;

          // Determine action based on HTTP method
          switch (req.method) {
            case "POST":
              action = "create";
              resourceId = data.data?._id;
              details = `Created new ${resource}: ${
                data.data?.name || data.data?.title || resourceId
              }`;
              break;
            case "PATCH":
            case "PUT":
              action = "update";
              resourceId = req.params.id;
              details = `Updated ${resource}: ${
                data.data?.name || data.data?.title || resourceId
              }`;
              break;
            case "DELETE":
              action = "delete";
              resourceId = req.params.id;
              details = `Deleted ${resource}: ${resourceId}`;
              break;
            default:
              // Don't log GET requests
              return res.json.call(this, data);
          }

          // Create activity log with capitalized resource name
          await ActivityLog.create({
            action,
            resource: capitalizedResource,
            resourceId,
            userId: req.user._id,
            details,
          });
        } catch (error) {
          console.error("Activity logging error:", error);
          // Continue with the response even if logging fails
        }
      }

      // Call the original send function
      return res.json.call(this, data);
    };

    next();
  };
};

// Special middleware for auth activities
export const logAuthActivity = async (req, user, action) => {
  try {
    await ActivityLog.create({
      action,
      resource: "User", // Capitalized
      resourceId: user._id,
      userId: user._id,
      details: `User ${action}: ${user.email}`,
    });
  } catch (error) {
    console.error("Auth activity logging error:", error);
  }
};
