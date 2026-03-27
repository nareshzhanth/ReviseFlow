const express = require("express");
const { db } = require("../db");

const router = express.Router();

router.get("/", (_req, res) => {
  const totals = db
    .prepare(`
      SELECT
        (SELECT COUNT(*) FROM problems) AS totalProblems,
        (SELECT COUNT(*) FROM revisions WHERE status = 'completed') AS completedRevisions,
        (SELECT COUNT(*) FROM revisions WHERE status = 'pending') AS pendingRevisions
    `)
    .get();

  const problemProgress = db
    .prepare(`
      SELECT
        p.id,
        p.name,
        p.topic,
        p.created_at,
        SUM(CASE WHEN r.status = 'completed' THEN 1 ELSE 0 END) AS completedRevisions,
        COUNT(r.id) AS totalRevisions
      FROM problems p
      LEFT JOIN revisions r ON r.problem_id = p.id
      GROUP BY p.id
      ORDER BY p.created_at DESC, p.id DESC
    `)
    .all();

  const revisionBreakdown = db
    .prepare(`
      SELECT
        revision_day AS revisionDay,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
        COUNT(*) AS total
      FROM revisions
      GROUP BY revision_day
      ORDER BY revision_day ASC
    `)
    .all()
    .map((row) => ({
      revisionDay: row.revisionDay,
      completed: row.completed,
      pending: row.pending,
      total: row.total,
      percentage: row.total === 0 ? 0 : Math.round((row.completed / row.total) * 100),
    }));

  const topicCounts = db
    .prepare(`
      SELECT
        topic,
        COUNT(*) AS count
      FROM problems
      WHERE topic IS NOT NULL AND TRIM(topic) != ''
      GROUP BY topic
      ORDER BY count DESC, topic COLLATE NOCASE ASC
    `)
    .all();

  const problems = problemProgress.map((problem) => ({
    id: problem.id,
    name: problem.name,
    topic: problem.topic,
    created_at: problem.created_at,
    completed: problem.completedRevisions,
    total: problem.totalRevisions,
  }));

  return res.json({
    totalProblems: totals.totalProblems,
    completedRevisions: totals.completedRevisions,
    pendingRevisions: totals.pendingRevisions,
    problems,
    problemProgress,
    revisionBreakdown,
    topicCounts,
  });
});

module.exports = router;
