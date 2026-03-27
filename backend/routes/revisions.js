const express = require("express");
const { db, formatDate } = require("../db");

const router = express.Router();

router.get("/today", (req, res) => {
  const today = formatDate(new Date());
  const statusFilter = req.query.status;

  let query = `
    SELECT
      r.id,
      r.problem_id,
      p.name AS problem_name,
      r.revision_day,
      r.revision_date,
      r.status
    FROM revisions r
    INNER JOIN problems p ON p.id = r.problem_id
    WHERE r.revision_date = ?
  `;

  const params = [today];

  if (statusFilter === "pending" || statusFilter === "completed") {
    query += " AND r.status = ?";
    params.push(statusFilter);
  }

  query += " ORDER BY r.status ASC, r.revision_day ASC, p.name COLLATE NOCASE ASC";

  const revisions = db.prepare(query).all(...params);
  return res.json(revisions);
});

router.put("/:id", (req, res) => {
  const revisionId = Number(req.params.id);
  const nextStatus =
    req.body?.status === "completed" ? "completed" : "pending";

  const updateResult = db
    .prepare(`
      UPDATE revisions
      SET status = ?
      WHERE id = ?
    `)
    .run(nextStatus, revisionId);

  if (updateResult.changes === 0) {
    return res.status(404).json({ message: "Revision not found." });
  }

  const updatedRevision = db
    .prepare(`
      SELECT
        r.id,
        r.problem_id,
        p.name AS problem_name,
        r.revision_day,
        r.revision_date,
        r.status
      FROM revisions r
      INNER JOIN problems p ON p.id = r.problem_id
      WHERE r.id = ?
    `)
    .get(revisionId);

  return res.json(updatedRevision);
});

module.exports = router;
