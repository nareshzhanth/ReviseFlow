const express = require("express");
const { db, formatDate, addDays } = require("../db");

const router = express.Router();

router.post("/", (req, res) => {
  const name = req.body?.name?.trim();
  const topic = req.body?.topic?.trim() || null;

  if (!name) {
    return res.status(400).json({ message: "Problem name is required." });
  }

  const today = new Date();
  const createdAt = formatDate(today);
  const revisionDays = [1, 3, 7];

  const createProblem = db.prepare(`
    INSERT INTO problems (name, topic, created_at)
    VALUES (?, ?, ?)
  `);

  const createRevision = db.prepare(`
    INSERT INTO revisions (problem_id, revision_day, revision_date, status)
    VALUES (?, ?, ?, 'pending')
  `);

  const transaction = db.transaction(() => {
    const problemResult = createProblem.run(name, topic, createdAt);
    const problemId = problemResult.lastInsertRowid;

    revisionDays.forEach((revisionDay) => {
      createRevision.run(
        problemId,
        revisionDay,
        formatDate(addDays(today, revisionDay))
      );
    });

    return problemId;
  });

  const problemId = transaction();
  const problem = db
    .prepare("SELECT id, name, topic, created_at FROM problems WHERE id = ?")
    .get(problemId);

  return res.status(201).json(problem);
});

router.get("/", (_req, res) => {
  const problems = db
    .prepare(`
      SELECT
        p.id,
        p.name,
        p.topic,
        p.created_at,
        COUNT(r.id) AS total_revisions,
        SUM(CASE WHEN r.status = 'completed' THEN 1 ELSE 0 END) AS completed_revisions
      FROM problems p
      LEFT JOIN revisions r ON r.problem_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC, p.id DESC
    `)
    .all();

  return res.json(problems);
});

router.put("/:id", (req, res) => {
  const problemId = Number(req.params.id);
  const name = req.body?.name?.trim();
  const topic = req.body?.topic?.trim() || null;

  if (!name) {
    return res.status(400).json({ message: "Problem name is required." });
  }

  const updateResult = db
    .prepare(`
      UPDATE problems
      SET name = ?, topic = ?
      WHERE id = ?
    `)
    .run(name, topic, problemId);

  if (updateResult.changes === 0) {
    return res.status(404).json({ message: "Problem not found." });
  }

  const updatedProblem = db
    .prepare("SELECT id, name, topic, created_at FROM problems WHERE id = ?")
    .get(problemId);

  return res.json(updatedProblem);
});

router.delete("/:id", (req, res) => {
  const problemId = Number(req.params.id);

  const deleteResult = db
    .prepare(`
      DELETE FROM problems
      WHERE id = ?
    `)
    .run(problemId);

  if (deleteResult.changes === 0) {
    return res.status(404).json({ message: "Problem not found." });
  }

  return res.json({ message: "Problem deleted successfully." });
});

module.exports = router;
