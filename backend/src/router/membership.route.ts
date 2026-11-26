import express from "express";
import {
  addMember,
  LeaveWorkspace,
  removeMember,
  updateMember,
  viewMembers,
} from "../controller/Membership.controlller.js";
import isAuth from "../middleware/isAuth.js";

const membershipRoute = express.Router();

membershipRoute.get("/:slug/members", isAuth, viewMembers);
membershipRoute.post("/:workspaceId/members/:id", isAuth, addMember);
membershipRoute.patch("/:workspaceId/members/:id", isAuth, updateMember);
membershipRoute.delete("/:workspaceId/members/:id", isAuth, removeMember);
membershipRoute.delete("/:workspaceId/leave", isAuth, LeaveWorkspace);

export default membershipRoute;
