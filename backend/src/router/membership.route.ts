import express from "express";
import {
  addMember,
  LeaveWorkspace,
  removeMember,
  updateMember,
  viewMembers,
} from "../controller/Membership.controlller.js";

const membershipRoute = express.Router();

membershipRoute.get("/:slug/members", viewMembers);
membershipRoute.post("/:workspaceId/members/:id", addMember);
membershipRoute.patch("/:workspaceId/members/:id", updateMember);
membershipRoute.delete("/:workspaceId/members/:id", removeMember);
membershipRoute.delete("/:workspaceId/leave", LeaveWorkspace);

export default membershipRoute;
